# Patches (applied by `patch-package` on `npm install`)

## react-native — trailing hair space on Android Text

React Native's Android text measurement can return a width a fraction of a pixel smaller
than the width later used to lay the text out for drawing. For complex-shaped scripts
(Bangla conjuncts, Arabic) that fraction is enough for the last word to wrap onto a second
line, which is then clipped — e.g. "গণনা করতে বৃত্তে ট্যাপ করুন" rendered as
"গণনা করতে বৃত্তে ট্যাপ". The patch appends U+200A (hair space) to every outermost
`<Text>` on Android: it adds a pixel or two to the measured width, and trailing whitespace
is allowed to hang past the line end, so it never wraps itself.

Re-check when upgrading React Native; drop the patch once upstream measurement is fixed.
