import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { Movie } from "./models/movie";
import ShowMovie from "./ShowMovie";
import { useState } from "react";
import type { Rating } from "./models/rating";
import type { LogAgent } from "./LogService";

export default function RateDialog(props: {
  openDialog: boolean
  handleDialogClose: () => void
  selectedMovie: Movie
  setRating: (newRating: Rating) => void
  logAgent?: LogAgent
}) {

  const [userRating, setUserRating] = useState(0)

  return (
    <Dialog open={props.openDialog} onClose={props.handleDialogClose}>
      <DialogTitle>Rate {props.selectedMovie.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Levá strana s obrázkem a názvem */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ShowMovie movie={props.selectedMovie} width="200px" />
          </Box>

          {/* Pravá strana s TextField pro hodnocení */}
          <Box sx={{ flex: 1, paddingLeft: '20px' }}>
            <TextField
              label="Rate the movie (0-100)"
              type="number"
              value={userRating}
              onChange={(e) =>
                setUserRating(
                  Math.min(
                    100,
                    Math.max(0, parseInt(e.target.value)),
                  ),
                )
              }
              fullWidth
              variant="outlined"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleDialogClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => {
          props.handleDialogClose()

          const normalizedRating = userRating / 20
          if(props.logAgent) props.logAgent.write(`User rated movie from recommendation. Movie: ${JSON.stringify(props.selectedMovie)}`, `${normalizedRating}`)
          props.setRating({
            movie: props.selectedMovie,
            rating: normalizedRating,
          })
        }} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
