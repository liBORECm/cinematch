import { useEffect, useState } from 'react'
import type { Rating } from './models/rating'
import type { Movie } from './models/movie'
import { Service } from './Service'
import {
  TextField,
  Paper,
  MenuItem,
  CircularProgress,
  MenuList,
} from '@mui/material'
import type { UserProfile } from './models/userProfile'
import ShowMovie from './ShowMovie'
import RateDialog from './RateDialog'

export default function MovieSearch(props: {
  profile: UserProfile
  onSelect: (selected: Rating) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(
    null,
  )
  const [userRating, setUserRating] = useState<number>(0)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      try {
        const results = await Service.getMovies(10, 0, searchQuery)
        setSearchResults(
          results.filter(
            (movie) =>
              props.profile.movieRatings.find(
                (rating) => rating.movie.id === movie.id,
              ) == undefined,
          ),
        )
      } catch (error) {
        console.error('Chyba při hledání filmů:', error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setUserRating(0) // Reset rating when dialog is closed
  }

  const handleRatingSubmit = () => {
    const normalizedRating = userRating / 20 // Convert from 0-100 to 0-5 scale
    console.log({
      movie: selectedMovie,
      rating: normalizedRating,
    })
    if (selectedMovie) {
      const haaa = selectedMovie
      const normalizedRating = userRating / 20
      props.onSelect({
        movie: haaa,
        rating: normalizedRating,
      })
    }
    setSearchQuery('')
    setSearchResults([])
    handleDialogClose()
  }

  return (
    <div
      className="section-search"
      style={{ flex: 1, position: 'relative' }}
    >
      <h2>Find and rate movie</h2>

      {/* MUI TextField pro search bar */}
      <TextField
        label="E.g. Spider-Man..."
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: '1rem',
        }}
      />

      {/* Spinner pokud se hledá */}
      {isSearching && (
        <CircularProgress
          size={24}
          style={{ position: 'absolute', top: '50%', left: '50%' }}
        />
      )}

      {/* Výsledky hledání */}
      {searchResults.length > 0 && (
        <Paper
          elevation={3}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000, // Aby byly výsledky nad ostatními elementy
          }}
        >
          {/* MenuList obaluje MenuItem pro správný kontext */}
          <MenuList>
            {searchResults.map((movie) => {
              return (
                <MenuItem
                  key={movie.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                  }}
                  onClick={() => handleMovieClick(movie)}
                >
                  <ShowMovie movie={movie} width={'400px'} />
                </MenuItem>
              )
            })}
          </MenuList>
        </Paper>
      )}

      {selectedMovie !== null && (
        <RateDialog
          openDialog={openDialog}
          handleDialogClose={handleDialogClose}
          selectedMovie={selectedMovie}
          setRating={(newRating) => {
            props.onSelect(newRating)
            setSearchQuery('')
            setSearchResults([])
          }}
        />
      )}
    </div>
  )
}
