import { useEffect, useState } from 'react'
import { Movie } from './models/movie'
import { UserProfile } from './models/userProfile'
import './App.css'
import { Box, Paper } from '@mui/material'
import RatingsTab from './RatingsTab'
import ShowRecommended from './ShowRecommended'
import GetRecommendations from './GetRecommendation'

function App() {
  const [profile, _setProfile] = useState<UserProfile>(
    new UserProfile([]),
  )
  const [recommendationsContent, setRecommendationsContent] =
    useState<
      {
        movie: Movie
        seen: boolean
      }[]
    >([])
  const [recommendationsCollab, setRecommendationsCollab] = useState<
    {
      movie: Movie
      seen: boolean
    }[]
  >([])
  const [ratingsChanged, setRatingsChanged] = useState(false)

  const setProfile = (newUser: UserProfile) => {
    _setProfile(newUser)
    setRatingsChanged(true)
  }


  console.log(ratingsChanged)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Hlavní vrstva stránky */}

      {/* Horní bar (15% výšky) */}
      <Box sx={{ height: '5%', backgroundColor: '#ccc' }}>
        {/* Sem můžeš přidat obsah pro horní bar */}
      </Box>

      {/* Spodní část stránky rozdělená do sloupců */}
      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Levý sloupec (25% šířky) */}
        <Box sx={{ width: '25%', padding: '1rem' }}>
          <Paper sx={{ padding: '1rem' }}>
            <RatingsTab
              profile={profile}
              setProfile={setProfile}
            />
          </Paper>
        </Box>

        {/* Střední část stránky */}
        <Box
          sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {/* Horní část uprostřed (70% šířky) */}
          <Box sx={{ flex: 1, marginBottom: '1rem' }}>
            <Paper sx={{ padding: '1rem', height: '100%' }}>
              <ShowRecommended
                recommendedCollab={recommendationsCollab}
                recommendedContent={recommendationsContent}
                makeUnseenCollab={() => setRecommendationsCollab(recommendationsCollab.map(({movie})=> ({movie, seen: false})))}
                makeUnseenContent={() => setRecommendationsContent(recommendationsContent.map(({movie})=> ({movie, seen: false})))}
                profile={profile}
                setProfile={setProfile}
              />
            </Paper>
          </Box>

          {/* Spodní část uprostřed */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ padding: '1rem', height: '100%' }}>
              <GetRecommendations
                profile={profile}
                setRecommendedCollab={setRecommendationsCollab}
                setRecommendedContent={setRecommendationsContent}
                recommendedCollab={recommendationsCollab}
                recommendedContent={recommendationsContent}
                ratingsChanged={ratingsChanged}
                setRatingsChanged={setRatingsChanged}
              />
            </Paper>
          </Box>
        </Box>

        {/* Pravý sloupec (25% šířky) */}
        <Box sx={{ width: '25%' }} />
      </Box>
    </Box>
  )
}

export default App
