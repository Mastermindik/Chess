import { IPromotion } from "../../models/IGame"

import wb from "../../assets/wb.png"
import wn from "../../assets/wn.png"
import wr from "../../assets/wr.png"
import wq from "../../assets/wq.png"
import bb from "../../assets/bb.png"
import bn from "../../assets/bn.png"
import br from "../../assets/br.png"
import bq from "../../assets/bq.png"
import { move } from "../../game/Game"

type PromoteProps = {
  promotions: IPromotion
}
const pieceImg = {
  wb,
  wn,
  wr,
  wq,
  bb,
  bn,
  br,
  bq
}

export default function Promote({
  promotions: { color, from, promotionPieces, to }
}: PromoteProps) {
  return (
    <div className="promotion">
      {promotionPieces.map(e => 
      <div key={e} className="promotion_item" onClick={() => move(from, to, e)}>
        <img src={pieceImg[`${color}${e}`]} alt={e} />
      </div>
       )}
    </div>
  )
}
