import { Router } from "express"
import { contentBasedRecommender } from "./contenBasedRecommender.service"
import { UserProfile } from "../../models/userProfile"

const router = Router()

//TODO this route should be get and it should load saved usersprofile
//also smthing like post usersprofile should be here or somewhere
router.post(`/recommend`, async (req, res) => {
  let ratingsArray: Array<{ imdbId: number; rating: number }> = []

  const ratingsRaw = req.body.ratings
  console.log(typeof(ratingsRaw))
  console.log(ratingsRaw)
  
  try {
    console.log(ratingsRaw, typeof(ratingsRaw))
    ratingsArray = ratingsRaw
  } catch (err) {
    return res.status(400).json({error: 'Invalid ratings JSON'})
  }

  try {
    const recommendations = await contentBasedRecommender.recommend(new UserProfile(ratingsArray))
    res.status(200).json(recommendations)
  } catch (e) {
    res.status(500).json({error: "idk"})
  }
})

export const contentBasedRecommenderRoutes = router
