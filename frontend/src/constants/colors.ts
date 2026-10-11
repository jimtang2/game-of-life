export type Color = number;

export const colors: Color[] = [
	0x021b4a, // deep navy
	0x043d69, // dark blue
	0x4c4b6b, // slate indigo
	0x035884, // blue
	0x04799e, // blue-teal
	0x03a0ba, // cyan-blue
	0x05b6c3, // cyan
	0x05cade, // bright cyan
	0x2bc4c3, // turquoise
	0x52d2c7, // aqua
	0x7bdcc9, // light aqua
	0xade1c7, // pale mint
	0x05b9a0, // green-teal
	0x598060, // muted green

	0xf9fce3, // warm white
	0xffda9c, // pale peach
	0xf1cf9d, // sand
	0xf9c222, // golden yellow
	0xfe8729, // orange
	0xff9c34, // orange
	0xe67a32, // orange
	0xf88363, // coral
	0xf0563f, // coral red
	0xcb250d, // deep red-orange

	0x955246, // muted terracotta
	0xb71546, // crimson
	0xc11449, // magenta-red
	0x88103d, // burgundy
	0x1f0e20, // dark plum

	0x1d3132, // dark teal
	0x213b3a, // teal
	0x888791, // gray-blue
];

export function uint32ToHex(color: number): string {
	return `#${(color >>> 0).toString(16).padStart(6, "0").slice(-6)}`;
}
