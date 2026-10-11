package game

import "fmt"

type Color uint32 // 0xRRGGBB

func NewColor(r, g, b uint8) Color {
	return Color(uint32(r)<<16 | uint32(g)<<8 | uint32(b))
}

func (c Color) RGB() (r, g, b uint8) {
	return uint8(c >> 16), uint8(c >> 8), uint8(c)
}

func (c Color) Hex() string {
	return fmt.Sprintf("#%06x", uint32(c))
}

func mixColors(colors []Color) Color {
	if len(colors) != 3 {
		return Color(0)
	}

	var r, g, b int
	for _, col := range colors {
		r = r + int(uint8(col>>16))
		g = g + int(uint8(col>>8))
		b = b + int(uint8(col))
	}
	return NewColor(
		uint8(r/len(colors)),
		uint8(g/len(colors)),
		uint8(b/len(colors)),
	)
}
