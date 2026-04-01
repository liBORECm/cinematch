import { useState, useEffect } from 'react'
import { DataManager } from './DataManager' // Uprav cestu podle tvé struktury
import { Movie } from './models/movie'
import { UserProfile } from './models/userProfile'
import './App.css'

// Pomocný typ pro držení filmu a jeho hodnocení pospolu
interface RatedMovie {
  movie: Movie
  rating: number
}

function App() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([])
  
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isRecommending, setIsRecommending] = useState(false)

  // --- ACTIONS ---

  // 1. Vyhledávání filmů s primitivním debouncem (aby to nevolalo API při každém úhozu)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      try {
        const results = await DataManager.getMovies(10, 0, searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error("Chyba při hledání filmů:", error)
      } finally {
        setIsSearching(false)
      }
    }, 500) // Půl vteřiny po dopsání to pošle request

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // 2. Přidání/Změna/Odebrání hodnocení
  const handleRateMovie = (movie: Movie, rating: number) => {
    setRatedMovies((prev) => {
      const existingIndex = prev.findIndex((rm) => rm.movie.id === movie.id)
      
      // Pokud je hodnocení 0 (nebo uživatel klikne na "odstranit"), vyhodíme ho ze seznamu
      if (rating === 0) {
        return prev.filter((rm) => rm.movie.id !== movie.id)
      }

      // Pokud už ve state je, updatneme rating
      if (existingIndex >= 0) {
        const newState = [...prev]
        newState[existingIndex] = { ...newState[existingIndex], rating }
        return newState
      }

      // Jinak přidáme nový
      return [...prev, { movie, rating }]
    })
  }

  // 3. Získání doporučení
  const handleGetRecommendations = async () => {
    if (ratedMovies.length === 0) return

    setIsRecommending(true)
    try {
      // Tady předpokládám, že Movie.id je to samé co UserProfile očekává pod imdbId
      const ratingsPayload = ratedMovies.map((rm) => ({
        imdbId: rm.movie.id,
        rating: rm.rating,
      }))
      
      const profile = new UserProfile(ratingsPayload)
      const results = await DataManager.recommendContentBased(profile)
      setRecommendations(results)
    } catch (error) {
      console.error("Chyba při získávání doporučení:", error)
    } finally {
      setIsRecommending(false)
    }
  }

  // --- RENDER ---
  return (
    <div className="app-container" style={{ display: 'flex', gap: '2rem', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* LEVÝ SLOUPEC: Hledání filmů */}
      <div className="section-search" style={{ flex: 1 }}>
        <h2>Vyhledat film</h2>
        <input
          type="text"
          placeholder="Např. Spider-Man..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        
        {isSearching && <p>Hledám...</p>}
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {searchResults.map((movie) => {
            // Zjistíme, jestli už ho máme ohodnocený, abychom ukázali aktuální stav
            const currentRating = ratedMovies.find(rm => rm.movie.id === movie.id)?.rating || 0

            return (
              <li key={movie.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
                <strong>{movie.title}</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateMovie(movie, star)}
                      style={{
                        backgroundColor: currentRating >= star ? 'gold' : '#eee',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        marginRight: '4px'
                      }}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* PROSTŘEDNÍ SLOUPEC: Můj seznam (UserProfile) */}
      <div className="section-profile" style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '2rem' }}>
        <h2>Můj hodnocený seznam</h2>
        {ratedMovies.length === 0 ? (
          <p>Zatím jsi neohodnotil žádný film. Najdi nějaký vlevo!</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {ratedMovies.map((rm) => (
                <li key={rm.movie.id} style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{rm.movie.title} (<strong>{rm.rating} ★</strong>)</span>
                  <button onClick={() => handleRateMovie(rm.movie, 0)} style={{ color: 'red' }}>
                    Odebrat
                  </button>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleGetRecommendations}
              disabled={isRecommending}
              style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {isRecommending ? 'Počítám doporučení...' : 'Doporučit další filmy'}
            </button>
          </>
        )}
      </div>

      {/* PRAVÝ SLOUPEC: Doporučení */}
      <div className="section-recommendations" style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '2rem' }}>
        <h2>Doporučeno pro tebe</h2>
        {recommendations.length === 0 && !isRecommending ? (
          <p>Klikni na tlačítko pro získání doporučení na základě tvého vkusu.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recommendations.map((movie) => (
              <li key={movie.id} style={{ padding: '0.5rem 0', borderBottom: '1px dotted #ccc' }}>
                ⭐ {movie.title}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

export default App