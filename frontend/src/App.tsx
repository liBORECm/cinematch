/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Movie } from './models/movie'
import { UserProfile } from './models/userProfile'
import './App.css'
import { Box, Paper, Tooltip } from '@mui/material'
import RatingsTab from './RatingsTab'
import ShowRecommended from './ShowRecommended'
import GetRecommendations from './GetRecommendation'
import { Typography, IconButton } from '@mui/material'
import DataObjectIcon from '@mui/icons-material/DataObject'
import UploadIcon from '@mui/icons-material/Upload'
import HistoryIcon from '@mui/icons-material/History'
import { LogService } from './LogService'

function App() {
  useEffect(() => {
    document.title = "Cinematch 🔥";
  }, []);
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


  const getJSON = () => {
    const dataStr = JSON.stringify(profile, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cinematch_profile_${new Date().toISOString()}.json`
    a.click()

    URL.revokeObjectURL(url)
  }

  const loadJSON = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const parsed = JSON.parse(event.target.result)

          // očekáváme strukturu kompatibilní s UserProfile
          const newProfile = new UserProfile(parsed.movieRatings)
          setProfile(newProfile)
        } catch (err) {
          console.error('Invalid JSON')
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  const getLogs = () => {
    const dataStr = JSON.stringify(LogService.log, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cinematch_log_${new Date().toISOString()}.json`
    a.click()

    URL.revokeObjectURL(url)
  }

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
<Box
  sx={{
    height: '5%',
    backgroundColor: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
  }}
>
  {/* Levá mezera kvůli centru */}
  <Box sx={{ width: '25%' }} />

      {/* Nadpis */}
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        Cinematch
      </Typography>

      {/* Pravá část - ikonky */}
      <Box sx={{ width: '25%', display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="Save your profile"><IconButton onClick={getJSON}>
          <DataObjectIcon />
        </IconButton></Tooltip>

        {profile.movieRatings.length === 0 && <Tooltip title="Load your profile"><IconButton onClick={loadJSON}>
          <UploadIcon />
        </IconButton></Tooltip>}

        <Tooltip title="Save history"><IconButton onClick={getLogs}>
          <HistoryIcon />
        </IconButton></Tooltip>
      </Box>
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
          sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '90vh'}}
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
