import { IPromotion } from "../../models/IGame"

import b_b from "../../assets/b_b.png"
import b_w from "../../assets/b_w.png"
import n_b from "../../assets/n_b.png"
import n_w from "../../assets/n_w.png"
import q_b from "../../assets/q_b.png"
import q_w from "../../assets/q_w.png"
import r_b from "../../assets/r_b.png"
import r_w from "../../assets/r_w.png"
import { move } from "../../game/Game"

type PromoteProps = {
  promotions: IPromotion
}
const pieceImg = {
  b_b,
  b_w,
  n_b,
  n_w,
  q_b,
  q_w,
  r_b,
  r_w
}

export default function Promote({
  promotions: { color, from, promotionPieces, to }
}: PromoteProps) {
  return (
    <div className="promotion">
      {promotionPieces.map(e => 
      <div key={e} className="promotion_item" onClick={() => move(from, to, e)}>
        <img src={pieceImg[`${e}_${color}`]} alt={e} />
      </div>
       )}
    </div>
  )
}
