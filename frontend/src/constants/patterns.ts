export type PatternBuilder = (x: number, y: number) => { x: number; y: number }[];

export type Pattern = {
	name: string;
	fn: PatternBuilder;
	width: number;
	height: number;
};

export const patterns: Pattern[] = [
	{
		name: "point",
		fn: (x, y) => [{ x, y }],
		width: 1,
		height: 1,
	},

	{
		name: "block",
		fn: (x, y) => [
			{ x, y },
			{ x: x + 1, y },
			{ x, y: y + 1 },
			{ x: x + 1, y: y + 1 },
		],
		width: 2,
		height: 2,
	},

	{
		name: "beehive",
		fn: (x, y) => [
			{ x: x + 1, y },
			{ x: x + 2, y },
			{ x, y: y + 1 },
			{ x: x + 3, y: y + 1 },
			{ x: x + 1, y: y + 2 },
			{ x: x + 2, y: y + 2 },
		],
		width: 4,
		height: 3,
	},

	{
		name: "loaf",
		fn: (x, y) => [
			{ x: x + 1, y },
			{ x: x + 2, y },
			{ x, y: y + 1 },
			{ x: x + 3, y: y + 1 },
			{ x: x + 1, y: y + 2 },
			{ x: x + 3, y: y + 2 },
			{ x: x + 2, y: y + 3 },
		],
		width: 4,
		height: 4,
	},

	{
		name: "boat",
		fn: (x, y) => [
			{ x, y },
			{ x: x + 1, y },
			{ x, y: y + 1 },
			{ x: x + 2, y: y + 1 },
			{ x: x + 1, y: y + 2 },
		],
		width: 3,
		height: 3,
	},

	{
		name: "tub",
		fn: (x, y) => [
			{ x: x + 1, y },
			{ x, y: y + 1 },
			{ x: x + 2, y: y + 1 },
			{ x: x + 1, y: y + 2 },
		],
		width: 3,
		height: 3,
	},

	{
		name: "blinker",
		fn: (x, y) => [
			{ x, y },
			{ x: x + 1, y },
			{ x: x + 2, y },
		],
		width: 3,
		height: 1,
	},

	{
		name: "toad",
		fn: (x, y) => [
			{ x: x + 1, y },
			{ x: x + 2, y },
			{ x: x + 3, y },
			{ x, y: y + 1 },
			{ x: x + 1, y: y + 1 },
			{ x: x + 2, y: y + 1 },
		],
		width: 4,
		height: 2,
	},

	{
		name: "beacon",
		fn: (x, y) => [
			{ x, y },
			{ x: x + 1, y },
			{ x, y: y + 1 },
			{ x: x + 1, y: y + 1 },
			{ x: x + 2, y: y + 2 },
			{ x: x + 3, y: y + 2 },
			{ x: x + 2, y: y + 3 },
			{ x: x + 3, y: y + 3 },
		],
		width: 4,
		height: 4,
	},

	{
		name: "pulsar",
		fn: (x, y) => [
			{ x: x + 2, y },
			{ x: x + 3, y },
			{ x: x + 4, y },
			{ x: x + 8, y },
			{ x: x + 9, y },
			{ x: x + 10, y },

			{ x, y: y + 2 },
			{ x: x + 5, y: y + 2 },
			{ x: x + 7, y: y + 2 },
			{ x: x + 12, y: y + 2 },
			{ x, y: y + 3 },
			{ x: x + 5, y: y + 3 },
			{ x: x + 7, y: y + 3 },
			{ x: x + 12, y: y + 3 },
			{ x, y: y + 4 },
			{ x: x + 5, y: y + 4 },
			{ x: x + 7, y: y + 4 },
			{ x: x + 12, y: y + 4 },

			{ x: x + 2, y: y + 5 },
			{ x: x + 3, y: y + 5 },
			{ x: x + 4, y: y + 5 },
			{ x: x + 8, y: y + 5 },
			{ x: x + 9, y: y + 5 },
			{ x: x + 10, y: y + 5 },

			{ x: x + 2, y: y + 7 },
			{ x: x + 3, y: y + 7 },
			{ x: x + 4, y: y + 7 },
			{ x: x + 8, y: y + 7 },
			{ x: x + 9, y: y + 7 },
			{ x: x + 10, y: y + 7 },

			{ x, y: y + 8 },
			{ x: x + 5, y: y + 8 },
			{ x: x + 7, y: y + 8 },
			{ x: x + 12, y: y + 8 },
			{ x, y: y + 9 },
			{ x: x + 5, y: y + 9 },
			{ x: x + 7, y: y + 9 },
			{ x: x + 12, y: y + 9 },
			{ x, y: y + 10 },
			{ x: x + 5, y: y + 10 },
			{ x: x + 7, y: y + 10 },
			{ x: x + 12, y: y + 10 },

			{ x: x + 2, y: y + 12 },
			{ x: x + 3, y: y + 12 },
			{ x: x + 4, y: y + 12 },
			{ x: x + 8, y: y + 12 },
			{ x: x + 9, y: y + 12 },
			{ x: x + 10, y: y + 12 },
		],
		width: 13,
		height: 13,
	},

	{
		name: "pentadecathlon",
		fn: (x, y) => [
			{ x: x + 2, y },
			{ x: x + 7, y },
			{ x, y: y + 1 },
			{ x: x + 1, y: y + 1 },
			{ x: x + 3, y: y + 1 },
			{ x: x + 4, y: y + 1 },
			{ x: x + 5, y: y + 1 },
			{ x: x + 6, y: y + 1 },
			{ x: x + 8, y: y + 1 },
			{ x: x + 9, y: y + 1 },
			{ x: x + 2, y: y + 2 },
			{ x: x + 7, y: y + 2 },
		],
		width: 10,
		height: 3,
	},

	{
		name: "glider",
		fn: (x, y) => [
			{ x: x + 1, y },
			{ x: x + 2, y: y + 1 },
			{ x, y: y + 2 },
			{ x: x + 1, y: y + 2 },
			{ x: x + 2, y: y + 2 },
		],
		width: 3,
		height: 3,
	},

	{
		name: "lwss",
		fn: (x, y) => [
			{ x: x + 1, y },
			{ x: x + 4, y },
			{ x, y: y + 1 },
			{ x, y: y + 2 },
			{ x: x + 4, y: y + 2 },
			{ x, y: y + 3 },
			{ x: x + 1, y: y + 3 },
			{ x: x + 2, y: y + 3 },
			{ x: x + 3, y: y + 3 },
		],
		width: 5,
		height: 4,
	},
	{
		name: "mwss",
		fn: (x, y) => [
			{ x: x + 3, y },
			{ x: x + 1, y: y + 1 },
			{ x: x + 5, y: y + 1 },
			{ x, y: y + 2 },
			{ x, y: y + 3 },
			{ x: x + 5, y: y + 3 },
			{ x, y: y + 4 },
			{ x: x + 1, y: y + 4 },
			{ x: x + 2, y: y + 4 },
			{ x: x + 3, y: y + 4 },
			{ x: x + 4, y: y + 4 },
		],
		width: 6,
		height: 5,
	},
	{
		name: "hwss",
		fn: (x, y) => [
			{ x: x + 3, y },
			{ x: x + 4, y },
			{ x: x + 1, y: y + 1 },
			{ x: x + 6, y: y + 1 },
			{ x, y: y + 2 },
			{ x, y: y + 3 },
			{ x: x + 6, y: y + 3 },
			{ x, y: y + 4 },
			{ x: x + 1, y: y + 4 },
			{ x: x + 2, y: y + 4 },
			{ x: x + 3, y: y + 4 },
			{ x: x + 4, y: y + 4 },
			{ x: x + 5, y: y + 4 },
		],
		width: 7,
		height: 5,
	},
];
