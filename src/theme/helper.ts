import type { AnyColor, ColorScheme, ColorToColorType } from '../types.js'
import { getColorType } from '../utils/index.js'
import { Theme } from './theme.js'
import { Scheme } from './scheme.js'

/**
 * 创建主题
 *
 * @template T - 颜色类型
 * @param {T} main - 主色，支持16进制字符串颜色、rgb颜色、hsl颜色、颜色对象
 * @param {Record<string,T>} customColorScheme - 自定义配色方案，如果和基本配色方案重名，会覆盖基本配色方案
 * @returns {Theme} - 主题实例
 */
export function createTheme<T extends AnyColor>(
  main: T,
  customColorScheme?: Record<string, ColorToColorType<T>>
): Theme<ColorToColorType<T>> {
  const primaryColorType = getColorType(main)
  // 创建基本配色方案
  const colorsScheme = Scheme.createBaseColorScheme(main)
  // 合并自定义配色方案
  if (typeof customColorScheme === 'object' && !Array.isArray(customColorScheme)) {
    for (const colorsKey in customColorScheme) {
      const value = customColorScheme[colorsKey]
      let type
      try {
        type = getColorType(value)
      } catch (e) {
        throw new Error(`custom color scheme ${colorsKey} is not a valid color`)
      }
      if (type !== primaryColorType) {
        throw new Error(
          `custom color scheme ${colorsKey} color type must be the same as the primary color type`
        )
      }
      colorsScheme[colorsKey as keyof ColorScheme<T>] = value
    }
  }
  return new Theme(colorsScheme)
}
