type AxisXProps = {
  letter: string
}

export default function AxisX({ letter }: AxisXProps) {
  return (
    <div className="axis_x">
      {letter}
    </div>
  )
}
