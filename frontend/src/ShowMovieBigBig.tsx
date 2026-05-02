import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { Movie } from './models/movie'
import { UserProfile } from './models/userProfile'

export default function ShowMovieBigBig(props: {
  movie: Movie
  handleClose: () => void
  setSelected?: (movie: Movie) => void
  profile?: UserProfile
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

        {props.setSelected !== undefined &&
          props.profile !== undefined &&
          props.profile.movieRatings.find(
            (m) => m.movie.id === props.movie.id,
          ) === undefined && (
            <Button
              onClick={() => {
                props.handleClose()
                props.setSelected!(props.movie)
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
