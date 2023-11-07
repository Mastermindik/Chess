import AxisY from "../axis/AxisY";

type YCoordinateProps = {
  flip?: boolean,
  hidden: boolean
}

export default function YCoordinate({ flip, hidden }: YCoordinateProps) {
  const vertical = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className={`vertical ${flip ? "flip" : ""} ${hidden ? "hidden" : ""}`}>
      {vertical.map(e => <AxisY number={e} key={e} />)}
    </div>
  )
}
