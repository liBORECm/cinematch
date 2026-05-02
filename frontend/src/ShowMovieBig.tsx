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
import ShowMovieBigBig from './ShowMovieBigBig'
import type { LogAgent } from './LogService'

export default function ShowMovieBig(props: {
  movie: Movie
  width: string
  profile: UserProfile
  setProfile: (newProfile: UserProfile) => void
  logAgent: LogAgent
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
        <ShowMovieBigBig
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
          logAgent={props.logAgent}
        />
      )}
    </Box>
  )
}
