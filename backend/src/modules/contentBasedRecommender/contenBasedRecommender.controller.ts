import { Router } from "express"
import { contentBasedRecommender } from "./contenBasedRecommender.service"
import { UserProfile } from "../../models/userProfile"

const router = Router()

router.post(`/recommend`, async (req, res) => {
  console.log("[content.controller] /recommend called")

  let ratingsArray: Array<{ imdbId: number; rating: number }> = []

  const ratingsRaw = req.body.ratings
  console.log("[content.controller] raw ratings:", ratingsRaw)
  
  try {
    ratingsArray = ratingsRaw
    if (!Array.isArray(ratingsArray)) {
      throw new Error("ratings is not an array")
    }
  } catch (err) {
    console.error("[content.controller] Invalid ratings JSON:", err)
    return res.status(400).json({ error: "Invalid ratings JSON" })
  }

  try {
    console.log("[content.controller] creating UserProfile")
    const recommendations = await contentBasedRecommender.recommend(
      new UserProfile(ratingsArray)
    )

    console.log("[content.controller] recommendations OK:", recommendations.length)
    res.status(200).json(recommendations)
  } catch (e) {
    console.error("[content.controller] ERROR during recommend:", e)
    res.status(500).json({ error: "Recommendation failed", details: e })
  }
})

export const contentBasedRecommenderRoutes = router
