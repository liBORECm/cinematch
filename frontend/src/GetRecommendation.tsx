import { Button } from '@mui/material'
import type { Movie } from './models/movie'
import type { UserProfile } from './models/userProfile'
import { Service } from './Service'

export default function GetRecommendations(props: {
  profile: UserProfile
  setRecommendedContent: (
    recommended: Array<{ movie: Movie; seen: boolean }>,
  ) => void
  setRecommendedCollab: (
    recommended: Array<{ movie: Movie; seen: boolean }>,
  ) => void
  recommendedContent: Array<{ movie: Movie; seen: boolean }>
  recommendedCollab: Array<{ movie: Movie; seen: boolean }>
  ratingsChanged: boolean
  setRatingsChanged: (haaaa: false) => void
}) {
  const recommend = async () => {
    const collab = await Service.recommendCollab(props.profile)
    const content = await Service.recommendContentBased(props.profile)

    props.setRecommendedCollab(
      collab.map((movie) => ({ movie, seen: false })),
    )
    props.setRecommendedContent(
      content.map((movie) => ({ movie, seen: false })),
    )
  }

  const shiftRecom = () => {
    // Create helper functions for handling unseen shifts
    const updateSeen = (
      movies: Array<{ movie: Movie; seen: boolean }>,
    ) => {
      let count = 0
      const updatedMovies = movies.map((movieObj) => {
        if (movieObj.seen === false && count < 2) {
          count += 1
          return { ...movieObj, seen: true }
        }
        return movieObj
      })
      return updatedMovies
    }

    // Update both lists with the first 2 unseen movies marked as seen
    const updatedCollab = updateSeen(props.recommendedCollab)
    const updatedContent = updateSeen(props.recommendedContent)

    // Set the updated lists
    props.setRecommendedCollab(updatedCollab)
    props.setRecommendedContent(updatedContent)
  }

  return (
    <>
      {props.ratingsChanged &&
        props.profile.movieRatings.length > 0 && (
          <Button
            onClick={() => {
              recommend()
              props.setRatingsChanged(false)
            }}
          >
            Suggest movies
          </Button>
        )}
      {!props.ratingsChanged && (
        <Button onClick={shiftRecom}>Suggest movies</Button>
      )}
    </>
  )
}
