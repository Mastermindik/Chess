type AxisYProps = {
  number: number
}

export default function AxisY({ number }: AxisYProps) {
  return (
    <div className="axis_y">
      {number}
    </div>
  )
}
