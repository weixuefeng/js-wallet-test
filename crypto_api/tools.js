'use strict';

function rotateLeft(x, n) {
  return ((x << n) | (x >>> (32 - n))) | 0;
}

function rotateRight(x, n) {
  return ((x >>> n) | (x << (32 - n))) | 0;
}

function rotateRight64hi(hi, lo, n) {
  if (n === 32) {
    return lo;
  }
  if (n > 32) {
    return rotateRight64hi(lo, hi, n - 32);
  }
  return ((hi >>> n) | (lo << (32 - n))) & (0xFFFFFFFF);
}

function rotateRight64lo(hi, lo, n) {
  if (n === 32) {
    return hi;
  }
  if (n > 32) {
    return rotateRight64lo(lo, hi, n - 32);
  }
  return ((lo >>> n) | (hi << (32 - n))) & (0xFFFFFFFF);
}

export {rotateLeft, rotateRight, rotateRight64lo, rotateRight64hi};