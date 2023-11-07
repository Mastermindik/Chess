import AxisX from "../axis/AxisX";

type XCoordinateProps = {
  flip?: boolean,
  hidden: boolean
}

export default function XCoordinate({ flip, hidden }: XCoordinateProps) {
  const horisontal = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div className={`horisontal ${flip ? "flip" : ""} ${hidden ? "hidden" : ""} `}>
      <div className="corner"></div>
      <div className="coordinates">
        {horisontal.map(e => <AxisX letter={e} key={e} />)}
      </div>
      <div className="corner"></div>
    </div>
  )
}
