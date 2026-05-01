import { Router } from "express"
import { collaborativeRecommender } from "./collaborativeRecommender.service"
import { UserProfile } from "../../models/userProfile"

const router = Router()

router.post(`/recommend`, async (req, res) => {
  console.log("[collab.controller] /recommend called")

  let ratingsArray: Array<{ imdbId: number; rating: number }> = []

  const ratingsRaw = req.body.ratings

  console.log("[collab.controller] raw ratings:", ratingsRaw)

  try {
    ratingsArray = ratingsRaw
    if (!Array.isArray(ratingsArray)) {
      throw new Error("ratings is not an array")
    }
  } catch (err) {
    console.error("[collab.controller] Invalid ratings JSON:", err)
    return res.status(400).json({ error: "Invalid ratings JSON" })
  }

  try {
    console.log("[collab.controller] creating UserProfile")
    const recommendations = await collaborativeRecommender.recommend(
      new UserProfile(ratingsArray)
    )

    console.log("[collab.controller] recommendations OK:", recommendations.length)
    res.status(200).json(recommendations)
  } catch (e) {
    console.error("[collab.controller] ERROR during recommend:", e)
    res.status(500).json({ error: "Recommendation failed", details: e })
  }
})

export const collaborativeRecommenderRoutes = router
