import Engine from "./Engine";
import textWrap from "./tools/textWrap";
import withTextStyle from "./withTextStyle";
import { xy } from "./tools/geometry";

export default class LogRenderer {
  constructor(
    public g: Engine,
    public position = xy(304, 0),
    public size = xy(144, 160),
    public padding = xy(2, 2)
  ) {}

  render() {
    const { padding, position, size } = this;
    const { ctx, log } = this.g;

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(position.x, position.y, size.x, size.y);

    const width = size.x - padding.x * 2;
    const textX = position.x + padding.x;
    let textY = position.y + size.y - padding.y;

    const { measure, draw } = withTextStyle(ctx, "left", "bottom", "white");
    for (let i = log.length - 1; i >= 0; i--) {
      const { lines, measurement } = textWrap(log[i], width, measure);

      for (const line of lines.reverse()) {
        draw(line, textX, textY);
        textY = Math.floor(
          textY -
            measurement.actualBoundingBoxAscent +
            measurement.actualBoundingBoxDescent
        );

        if (textY < position.y) return;
      }
    }
  }
}
