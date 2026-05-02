import { Box } from '@mui/material'
import { Movie } from './models/movie'
import { ShowRating } from './ShowRating'

export default function ShowMovie(props: {
  movie: Movie
  rating?: number
  width?: string
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        margin: '10px',
        ...(props.width !== undefined ? { width: props.width } : {}),
      }}
    >
      {/* Obrázek filmu */}
      <img
        src={`https://image.tmdb.org/t/p/w500/${props.movie.poster_path}`}
        height={'120px'}
        alt={props.movie.title}
      />

      {/* Box pro texty a hodnocení */}
      <Box
        sx={{
          width: '100%',
          height: '120px',
          display: 'flex',
          flexDirection: 'column', // Využijeme flexDirection pro vertikální uspořádání
          justifyContent: 'center', // Vertikální zarovnání na střed
          paddingLeft: '10px', // Pro trochu mezery mezi obrázkem a textem
        }}
      >
        {/* Název filmu */}
        <p
          style={{
            margin: 0,
            fontWeight: 'bold',
            wordWrap: 'break-word',
            maxWidth: props.width ? `calc(${props.width} - 40px)` : 'auto', // Maximální šířka pro title
            overflow: 'hidden',
            textOverflow: 'ellipsis', // Truncating long text with ellipsis if it overflows
            whiteSpace: 'normal', // Allow text to break into multiple lines
          }}
        >
          {props.movie.title}
        </p>

        {/* Rok vydání */}
        <p style={{ margin: 0 }}>
          {new Date(props.movie.release_date).getFullYear()}
        </p>

        {/* Pokud je hodnocení k dispozici, zobrazíme ho */}
        {props.rating !== undefined && <ShowRating rating={props.rating} />}
      </Box>
    </Box>
  )
}