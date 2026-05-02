import { Box, IconButton } from '@mui/material'
import { Delete, Edit, Info } from '@mui/icons-material'
import type { Rating } from './models/rating'
import ShowMovie from './ShowMovie'
import MovieSearch from './MovieSearch'
import { UserProfile } from './models/userProfile'
import RateDialog from './RateDialog'
import { useState } from 'react'
import type { Movie } from './models/movie'
import ShowMovieBigBig from './ShowMovieBigBig'

export default function RatingsTab(props: {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
}) {
  const [selectedMovieEdit, setSelectedMovieEdit] = useState<{
    movie: Movie
    index: number
  } | null>(null)
  const [selectedMovieShow, setSelectedMovieShow] =
    useState<Movie | null>(null)
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
      <Box
        sx={{
          maxHeight: '70vh', // Maximální výška 80% výšky okna
          overflowY: 'auto', // Povolení vertikálního scrollování
          paddingRight: '16px', // Přidání mezery pro scrollbar
        }}
      >
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
            <ShowMovie
              movie={rating.movie}
              rating={rating.rating}
              width="320px"
            />

            {/* Ikony pro editaci a odstranění */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column"}}>
              {/* Ikona pro odstranění */}
              <IconButton
                onClick={() => handleRemoveMovie(rating.movie.id)}
                color="secondary"
                sx={{ marginRight: '8px' }}
              >
                <Delete />
              </IconButton>

              <IconButton
                onClick={() => {
                  setSelectedMovieEdit({
                    movie: rating.movie,
                    index: ind,
                  })
                  setDialogOpen(true)
                }}
                color="primary"
              >
                <Edit />
              </IconButton>

              <IconButton
                onClick={() => {
                  setSelectedMovieShow(rating.movie)
                }}
                color="success"
              >
                <Info />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      {selectedMovieEdit !== null && (
        <RateDialog
          openDialog={dialogOpen}
          handleDialogClose={() => setDialogOpen(false)}
          selectedMovie={selectedMovieEdit.movie}
          setRating={(newRating) => {
            setSelectedMovieEdit(null)
            props.setProfile(
              new UserProfile([
                ...props.profile.movieRatings.filter(
                  (_, i) => i < selectedMovieEdit.index,
                ),
                newRating,
                ...props.profile.movieRatings.filter(
                  (_, i) => i > selectedMovieEdit.index,
                ),
              ]),
            )
          }}
        />
      )}

      {selectedMovieShow !== null && (
        <ShowMovieBigBig
          movie={selectedMovieShow}
          handleClose={() => setSelectedMovieShow(null)}
        />
      )}
    </Box>
  )
}
