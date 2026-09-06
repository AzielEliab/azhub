import 'package:flutter/material.dart';

/// Black + gold + white. No analytics.
const Color kMatteBlack = Color(0xFF000000);
const Color kSurface = Color(0xFF0A0A0A);
const Color kGold = Color(0xFFC9A227);
const Color kGoldDim = Color(0xFF8A7219);
const Color kIvory = Color(0xFFFFFFFF);

ThemeData buildAppTheme() {
  const scheme = ColorScheme.dark(
    brightness: Brightness.dark,
    primary: kGold,
    onPrimary: kMatteBlack,
    secondary: kGoldDim,
    onSecondary: kIvory,
    surface: kSurface,
    onSurface: kIvory,
    error: Color(0xFFB54A4A),
    onError: kIvory,
  );
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: scheme,
    scaffoldBackgroundColor: kMatteBlack,
    appBarTheme: const AppBarTheme(
      backgroundColor: kMatteBlack,
      foregroundColor: kGold,
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: CardThemeData(
      color: kSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: Color(0x33C9A227)),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFF1A1A1A),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: kGold),
      ),
    ),
  );
}
