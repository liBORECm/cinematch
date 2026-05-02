import type { Movie } from './models/movie'
import React, { useState, useEffect } from 'react'
import { Box, Grid, Button } from '@mui/material'
import ShowMovieBig from './ShowMovieBig'
import type { UserProfile } from './models/userProfile'

export default function ShowRecommended(props: {
  recommendedContent: Array<{ movie: Movie; seen: boolean }>
  recommendedCollab: Array<{ movie: Movie; seen: boolean }>
  makeUnseenCollab: () => void
  makeUnseenContent: () => void
  profile: UserProfile
  setProfile: (haaa: UserProfile) => void
}) {

  useEffect(() => {
    const unseenContent = props.recommendedContent.filter(
      (item) => !item.seen,
    )
    const unseenCollab = props.recommendedCollab.filter(
      (item) => !item.seen,
    )

    if (unseenContent.length === 0 && props.recommendedContent.length !== 0) {
      props.makeUnseenContent()
    }

    if (unseenCollab.length === 0 && props.recommendedCollab.length !== 0) {
      props.makeUnseenCollab()
    }
  }, [props])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box>
        {props.recommendedCollab
          .filter((item) => !item.seen)
          .slice(0, 2)
          .map((movieBox) => (
            <ShowMovieBig movie={movieBox.movie} width='400px' profile={props.profile} setProfile={props.setProfile}/>
          ))}
      </Box>

      <Box>
        {props.recommendedContent
          .filter((item) => !item.seen)
          .slice(0, 2)
          .map((movieBox) => (
            <ShowMovieBig movie={movieBox.movie} width='400px' profile={props.profile} setProfile={props.setProfile}/>
          ))}
      </Box>
    </Box>
  )
}
