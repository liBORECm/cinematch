import { Box, IconButton } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import type { Rating } from './models/rating'
import ShowMovie from './ShowMovie'
import MovieSearch from './MovieSearch'
import { UserProfile } from './models/userProfile'
import RateDialog from './RateDialog'
import { useState } from 'react'
import type { Movie } from './models/movie'

export default function RatingsTab(props: {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
}) {
  const [selectedMovie, setSelectedMovie] = useState<{movie: Movie, index: number} | null>(
    null,
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  // Funkce pro odstranění filmu z profilu
  const handleRemoveMovie = (movieId: number) => {
    const updatedRatings = props.profile.movieRatings.filter(
      (rating) => rating.movie.id !== movieId,
    )
    props.setProfile(new UserProfile(updatedRatings))
  }

  return (
    <Box>
      <Box>
        <MovieSearch
          onSelect={(selected: Rating) => {
            console.log("AHAAAA PICOOo")
            console.log(selected)
            console.log(props.setProfile)
            props.setProfile(
              new UserProfile([
                ...props.profile.movieRatings,
                selected,
              ]),
            )
          }}
          profile={props.profile}
        />
      </Box>
      <Box>
        {props.profile.movieRatings.map((rating, ind) => (
          <Box
            key={rating.movie.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              justifyContent: 'space-between',
            }}
          >
            {/* Zobrazení filmu */}
            <ShowMovie movie={rating.movie} rating={rating.rating} width="320px"/>

            {/* Ikony pro editaci a odstranění */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Ikona pro odstranění */}
              <IconButton
                onClick={() => handleRemoveMovie(rating.movie.id)}
                color="secondary"
                sx={{ marginRight: '8px' }}
              >
                <Delete />
              </IconButton>

              <IconButton onClick={() => {
                setSelectedMovie({movie: rating.movie, index: ind})
                setDialogOpen(true)
              }} color="primary">
                <Edit />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      {selectedMovie !== null && (
        <RateDialog
          openDialog={dialogOpen}
          handleDialogClose={() => setDialogOpen(false)}
          selectedMovie={selectedMovie.movie}
          setRating={(newRating) => {
            setSelectedMovie(null)
            props.setProfile(new UserProfile([
              ...props.profile.movieRatings.filter((_, i) => i < selectedMovie.index),
              newRating,
              ...props.profile.movieRatings.filter((_, i) => i > selectedMovie.index),
            ]))
          }}
        />
      )}
    </Box>
  )
}
