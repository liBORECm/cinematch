import { Box } from "@mui/material";
import type { Movie } from "./models/movie";
import ShowMovie from "./ShowMovie";

export default function ShowRecommended(props: {
  recommendedContent: Array<Movie>
  recommendedCollab: Array<Movie>
}) {

  return <Box>
    <Box>
      {props.recommendedCollab.map((movie) => <ShowMovie movie={movie} />)}
    </Box>
    <Box>
      {props.recommendedContent.map((movie) => <ShowMovie movie={movie} />)}
    </Box>
  </Box>
}