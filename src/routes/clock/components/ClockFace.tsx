import { CLOCK_SIZE, CLOCK_CX, CLOCK_CY, CLOCK_R } from "../constants";

type Props = {
  /** Угол стрелки в градусах (0 = 12 часов, по часовой) */
  angleDeg: number;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function ClockFace({ angleDeg }: Props) {
  const size = CLOCK_SIZE;
  const cx = CLOCK_CX;
  const cy = CLOCK_CY;
  const r = CLOCK_R;

  const innerR = r * 0.92;
  const numberR = r * 0.78;
  const hourTickInner = r * 0.85;
  const minuteTickInner = r * 0.93;

  const handLength = r * 0.6;
  const handX = cx + handLength * Math.sin(toRad(angleDeg));
  const handY = cy - handLength * Math.cos(toRad(angleDeg));

  const hourLabels = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      {/* Фон циферблата */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--mantine-color-gray-0)"
        stroke="var(--mantine-color-gray-4)"
        strokeWidth={3}
      />
      {/* Внутреннее кольцо */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke="var(--mantine-color-gray-3)"
        strokeWidth={1}
      />
      {/* 60 минутных рисок (каждые 6°) */}
      {Array.from({ length: 60 }, (_, i) => {
        const a = toRad(i * 6 - 90);
        const isHour = i % 5 === 0;
        const r1 = isHour ? hourTickInner : minuteTickInner;
        const r2 = r;
        const x1 = cx + r1 * Math.cos(a);
        const y1 = cy + r1 * Math.sin(a);
        const x2 = cx + r2 * Math.cos(a);
        const y2 = cy + r2 * Math.sin(a);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--mantine-color-gray-5)"
            strokeWidth={isHour ? 2.5 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {/* Цифры 1–12 */}
      {hourLabels.map((num, i) => {
        const a = toRad(i * 30 - 90);
        const x = cx + numberR * Math.cos(a);
        const y = cy + numberR * Math.sin(a);
        const isMain = num === 12 || num === 3 || num === 6 || num === 9;
        return (
          <text
            key={num}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--mantine-color-gray-8)"
            fontSize={isMain ? 16 : 13}
            fontWeight={isMain ? 700 : 500}
          >
            {num}
          </text>
        );
      })}
      {/* Центр (ось стрелки) */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="var(--mantine-color-gray-6)"
        stroke="var(--mantine-color-gray-5)"
        strokeWidth={1}
      />
      {/* Стрелка */}
      <line
        x1={cx}
        y1={cy}
        x2={handX}
        y2={handY}
        stroke="var(--mantine-color-red-6)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Небольшой круг у конца стрелки для читаемости */}
      <circle cx={handX} cy={handY} r={3} fill="var(--mantine-color-red-6)" />
    </svg>
  );
}
