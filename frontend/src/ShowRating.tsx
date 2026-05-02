import { Tooltip } from "@mui/material"

export function ShowRating(props: {
  rating: number
}) {
  const totalStars = 5 // Celkový počet hvězdiček

  return (<Tooltip title={props.rating * 20 + " %"}>
    <div>
      {/* Vykreslíme 5 hvězdiček */}
      {[...Array(totalStars)].map((_, index) => {
        const isFilled = index < props.rating
        return (
          <span
            key={index}
            style={{
              color: isFilled ? 'gold' : 'black', // Zlatá barva pro vyplněné hvězdičky
              fontSize: '24px', // Velikost hvězdičky
            }}
          >
            ★
          </span>
        )
      })}
    </div>
  </Tooltip>)
}