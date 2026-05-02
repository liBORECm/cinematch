import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { Movie } from './models/movie'
import { useState } from 'react'
import { UserProfile } from './models/userProfile'
import RateDialog from './RateDialog'

export default function ShowMovieBig(props: {
  movie: Movie
  width: string
  profile: UserProfile
  setProfile: (newProfile: UserProfile) => void
}) {
  const [openBigBig, setOpenBigBig] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(
    null,
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Změna směru layoutu na sloupec (column)
        margin: '10px',
        ...(props.width !== undefined ? { width: props.width } : {}),
      }}
      onClick={() => {
        console.log('???,')
        setOpenBigBig(true)
      }}
    >
      {/* Obrázek filmu */}
      <img
        src={`https://image.tmdb.org/t/p/w500/${props.movie.poster_path}`}
        style={{
          height: '280px', // Výška se přizpůsobí šířce pro zachování poměru stran
          objectFit: 'contain', // Udržení proporcí obrázku
        }}
        alt={props.movie.title}
      />

      {/* Box pro texty a hodnocení */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // Texty budou ve sloupci pod obrázkem
          justifyContent: 'flex-start', // Zarovnat texty na začátek
          paddingLeft: '10px', // Mezery mezi obrázkem a textem
        }}
      >
        {/* Název filmu */}
        <p
          style={{
            margin: 0,
            fontWeight: 'bold',
            wordWrap: 'break-word',
            maxWidth: props.width
              ? `calc(${props.width} - 40px)`
              : 'auto', // Maximální šířka pro title
            overflow: 'hidden',
            textOverflow: 'ellipsis', // Truncating long text with ellipsis if it overflows
            whiteSpace: 'normal', // Allow text to break into multiple lines
          }}
        >
          {props.movie.title}
        </p>

        <p style={{ margin: 0 }}>
          {new Date(props.movie.release_date).getFullYear()}
        </p>
      </Box>

      {openBigBig && (
        <BigBigShow
          movie={props.movie}
          handleClose={() => {
            console.log(openBigBig)
            setOpenBigBig(false)
          }}
          profile={props.profile}
          setSelected={(movie) => setSelectedMovie(movie)}
        />
      )}

      {selectedMovie !== null && (
        <RateDialog
          openDialog={selectedMovie !== null}
          handleDialogClose={() => setSelectedMovie(null)}
          selectedMovie={selectedMovie}
          setRating={(newRating) =>
            props.setProfile(
              new UserProfile([
                ...props.profile.movieRatings,
                newRating,
              ]),
            )
          }
        />
      )}
    </Box>
  )
}

function BigBigShow(props: {
  movie: Movie
  handleClose: () => void
  setSelected: (movie: Movie) => void
  profile: UserProfile
}) {
  return (
    <Dialog open={true} onClose={props.handleClose} maxWidth="lg">
      <DialogTitle>{props.movie.title}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          padding: '20px',
        }}
      >
        {/* Box pro obrázek */}
        <Box sx={{ marginRight: '20px' }}>
          <img
            src={`https://image.tmdb.org/t/p/w500/${props.movie.poster_path}`}
            width="350px"
            alt={props.movie.title}
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>

        {/* Box pro detaily */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ marginBottom: '20px' }}>
            <h3>Overview:</h3>
            <p>{props.movie.overview}</p>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <h3>Genres:</h3>
            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            >
              {props.movie.genres.map((genre, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: '6px 12px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  {genre}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <h3>Keywords:</h3>
            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            >
              {props.movie.keywords.map((keyword, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: '6px 12px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  {keyword}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <h3>Runtime:</h3>
            <p>{props.movie.runtime} minutes</p>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <h3>Original Language:</h3>
            <p>{props.movie.original_language}</p>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <h3>Release Date:</h3>
            <p>
              {new Date(
                props.movie.release_date,
              ).toLocaleDateString()}
            </p>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            props.handleClose()
          }}
          color="primary"
        >
          Close
        </Button>
        {props.profile.movieRatings.find(
          (m) => m.movie.id === props.movie.id,
        ) === undefined && (
          <Button
            onClick={() => {
              props.handleClose()
              props.setSelected(props.movie)
            }}
            color="primary"
          >
            Add to ratings
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
