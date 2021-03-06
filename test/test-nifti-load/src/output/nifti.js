import _pako from '../node_modules/pako/dist/pako.esm.mjs';

/*jslint browser: true, node: true */
/*** Imports ***/

var module$3 = {
  exports: {}
};
var nifti$4 = nifti$4 || {};
nifti$4.Utils = nifti$4.Utils || {};
/*** Static Pseudo-constants ***/

nifti$4.Utils.crcTable = null;
nifti$4.Utils.GUNZIP_MAGIC_COOKIE1 = 31;
nifti$4.Utils.GUNZIP_MAGIC_COOKIE2 = 139;
/*** Static methods ***/

nifti$4.Utils.getStringAt = function (data, start, end) {
  var str = '',
      ctr,
      ch;

  for (ctr = start; ctr < end; ctr += 1) {
    ch = data.getUint8(ctr);

    if (ch !== 0) {
      str += String.fromCharCode(ch);
    }
  }

  return str;
};

nifti$4.Utils.getByteAt = function (data, start) {
  return data.getInt8(start);
};

nifti$4.Utils.getShortAt = function (data, start, littleEndian) {
  return data.getInt16(start, littleEndian);
};

nifti$4.Utils.getIntAt = function (data, start, littleEndian) {
  return data.getInt32(start, littleEndian);
};

nifti$4.Utils.getFloatAt = function (data, start, littleEndian) {
  return data.getFloat32(start, littleEndian);
};

nifti$4.Utils.getDoubleAt = function (data, start, littleEndian) {
  return data.getFloat64(start, littleEndian);
};

nifti$4.Utils.getLongAt = function (data, start, littleEndian) {
  var ctr,
      array = [],
      value = 0;

  for (ctr = 0; ctr < 8; ctr += 1) {
    array[ctr] = nifti$4.Utils.getByteAt(data, start + ctr, littleEndian);
  }

  for (ctr = array.length - 1; ctr >= 0; ctr--) {
    value = value * 256 + array[ctr];
  }

  return value;
};

nifti$4.Utils.toArrayBuffer = function (buffer) {
  var ab, view, i;
  ab = new ArrayBuffer(buffer.length);
  view = new Uint8Array(ab);

  for (i = 0; i < buffer.length; i += 1) {
    view[i] = buffer[i];
  }

  return ab;
};

nifti$4.Utils.isString = function (obj) {
  return typeof obj === 'string' || obj instanceof String;
};

nifti$4.Utils.formatNumber = function (num, shortFormat) {
  var val = 0;

  if (nifti$4.Utils.isString(num)) {
    val = Number(num);
  } else {
    val = num;
  }

  if (shortFormat) {
    val = val.toPrecision(5);
  } else {
    val = val.toPrecision(7);
  }

  return parseFloat(val);
}; // http://stackoverflow.com/questions/18638900/javascript-crc32


nifti$4.Utils.makeCRCTable = function () {
  var c;
  var crcTable = [];

  for (var n = 0; n < 256; n++) {
    c = n;

    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
    }

    crcTable[n] = c;
  }

  return crcTable;
};

nifti$4.Utils.crc32 = function (dataView) {
  var crcTable = nifti$4.Utils.crcTable || (nifti$4.Utils.crcTable = nifti$4.Utils.makeCRCTable());
  var crc = 0 ^ -1;

  for (var i = 0; i < dataView.byteLength; i++) {
    crc = crc >>> 8 ^ crcTable[(crc ^ dataView.getUint8(i)) & 0xff];
  }

  return (crc ^ -1) >>> 0;
};
/*** Exports ***/


var moduleType$3 = typeof module$3;

if (moduleType$3 !== 'undefined' && module$3.exports) {
  module$3.exports = nifti$4.Utils;
}

var _utilitiesJs = module$3.exports;

/*jslint browser: true, node: true */
var module$2 = {
  exports: {}
};
var nifti$3 = nifti$3 || {};
nifti$3.Utils = nifti$3.Utils || _utilitiesJs;
/*** Constructor ***/

/**
 * The NIFTI1 constructor.
 * @constructor
 * @property {boolean} littleEndian
 * @property {number} dim_info
 * @property {number[]} dims - image dimensions
 * @property {number} intent_p1
 * @property {number} intent_p2
 * @property {number} intent_p3
 * @property {number} intent_code
 * @property {number} datatypeCode
 * @property {number} numBitsPerVoxel
 * @property {number} slice_start
 * @property {number} slice_end
 * @property {number} slice_code
 * @property {number[]} pixDims - voxel dimensions
 * @property {number} vox_offset
 * @property {number} scl_slope
 * @property {number} scl_inter
 * @property {number} xyzt_units
 * @property {number} cal_max
 * @property {number} cal_min
 * @property {number} slice_duration
 * @property {number} toffset
 * @property {string} description
 * @property {string} aux_file
 * @property {string} intent_name
 * @property {number} qform_code
 * @property {number} sform_code
 * @property {number} quatern_b
 * @property {number} quatern_c
 * @property {number} quatern_d
 * @property {number} quatern_x
 * @property {number} quatern_y
 * @property {number} quatern_z
 * @property {Array.<Array.<number>>} affine
 * @property {string} magic
 * @property {boolean} isHDR - if hdr/img format
 * @property {number[]} extensionFlag
 * @property {number} extensionSize
 * @property {number} extensionCode
 * @type {Function}
 */

nifti$3.NIFTI1 = nifti$3.NIFTI1 || function () {
  this.littleEndian = false;
  this.dim_info = 0;
  this.dims = [];
  this.intent_p1 = 0;
  this.intent_p2 = 0;
  this.intent_p3 = 0;
  this.intent_code = 0;
  this.datatypeCode = 0;
  this.numBitsPerVoxel = 0;
  this.slice_start = 0;
  this.slice_end = 0;
  this.slice_code = 0;
  this.pixDims = [];
  this.vox_offset = 0;
  this.scl_slope = 1;
  this.scl_inter = 0;
  this.xyzt_units = 0;
  this.cal_max = 0;
  this.cal_min = 0;
  this.slice_duration = 0;
  this.toffset = 0;
  this.description = '';
  this.aux_file = '';
  this.intent_name = '';
  this.qform_code = 0;
  this.sform_code = 0;
  this.quatern_b = 0;
  this.quatern_c = 0;
  this.quatern_d = 0;
  this.qoffset_x = 0;
  this.qoffset_y = 0;
  this.qoffset_z = 0;
  this.affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  this.magic = 0;
  this.isHDR = false;
  this.extensionFlag = [0, 0, 0, 0];
  this.extensionSize = 0;
  this.extensionCode = 0;
};
/*** Static Pseudo-constants ***/
// datatype codes


nifti$3.NIFTI1.TYPE_NONE = 0;
nifti$3.NIFTI1.TYPE_BINARY = 1;
nifti$3.NIFTI1.TYPE_UINT8 = 2;
nifti$3.NIFTI1.TYPE_INT16 = 4;
nifti$3.NIFTI1.TYPE_INT32 = 8;
nifti$3.NIFTI1.TYPE_FLOAT32 = 16;
nifti$3.NIFTI1.TYPE_COMPLEX64 = 32;
nifti$3.NIFTI1.TYPE_FLOAT64 = 64;
nifti$3.NIFTI1.TYPE_RGB24 = 128;
nifti$3.NIFTI1.TYPE_INT8 = 256;
nifti$3.NIFTI1.TYPE_UINT16 = 512;
nifti$3.NIFTI1.TYPE_UINT32 = 768;
nifti$3.NIFTI1.TYPE_INT64 = 1024;
nifti$3.NIFTI1.TYPE_UINT64 = 1280;
nifti$3.NIFTI1.TYPE_FLOAT128 = 1536;
nifti$3.NIFTI1.TYPE_COMPLEX128 = 1792;
nifti$3.NIFTI1.TYPE_COMPLEX256 = 2048; // transform codes

nifti$3.NIFTI1.XFORM_UNKNOWN = 0;
nifti$3.NIFTI1.XFORM_SCANNER_ANAT = 1;
nifti$3.NIFTI1.XFORM_ALIGNED_ANAT = 2;
nifti$3.NIFTI1.XFORM_TALAIRACH = 3;
nifti$3.NIFTI1.XFORM_MNI_152 = 4; // unit codes

nifti$3.NIFTI1.SPATIAL_UNITS_MASK = 0x07;
nifti$3.NIFTI1.TEMPORAL_UNITS_MASK = 0x38;
nifti$3.NIFTI1.UNITS_UNKNOWN = 0;
nifti$3.NIFTI1.UNITS_METER = 1;
nifti$3.NIFTI1.UNITS_MM = 2;
nifti$3.NIFTI1.UNITS_MICRON = 3;
nifti$3.NIFTI1.UNITS_SEC = 8;
nifti$3.NIFTI1.UNITS_MSEC = 16;
nifti$3.NIFTI1.UNITS_USEC = 24;
nifti$3.NIFTI1.UNITS_HZ = 32;
nifti$3.NIFTI1.UNITS_PPM = 40;
nifti$3.NIFTI1.UNITS_RADS = 48; // nifti1 codes

nifti$3.NIFTI1.MAGIC_COOKIE = 348;
nifti$3.NIFTI1.STANDARD_HEADER_SIZE = 348;
nifti$3.NIFTI1.MAGIC_NUMBER_LOCATION = 344;
nifti$3.NIFTI1.MAGIC_NUMBER = [0x6e, 0x2b, 0x31]; // n+1 (.nii)

nifti$3.NIFTI1.MAGIC_NUMBER2 = [0x6e, 0x69, 0x31]; // ni1 (.hdr/.img)

nifti$3.NIFTI1.EXTENSION_HEADER_SIZE = 8;
/*** Prototype Methods ***/

/**
 * Reads the header data.
 * @param {ArrayBuffer} data
 */

nifti$3.NIFTI1.prototype.readHeader = function (data) {
  var rawData = new DataView(data),
      magicCookieVal = nifti$3.Utils.getIntAt(rawData, 0, this.littleEndian),
      ctr,
      ctrOut,
      ctrIn,
      index;

  if (magicCookieVal !== nifti$3.NIFTI1.MAGIC_COOKIE) {
    // try as little endian
    this.littleEndian = true;
    magicCookieVal = nifti$3.Utils.getIntAt(rawData, 0, this.littleEndian);
  }

  if (magicCookieVal !== nifti$3.NIFTI1.MAGIC_COOKIE) {
    throw new Error('This does not appear to be a NIFTI file!');
  }

  this.dim_info = nifti$3.Utils.getByteAt(rawData, 39);

  for (ctr = 0; ctr < 8; ctr += 1) {
    index = 40 + ctr * 2;
    this.dims[ctr] = nifti$3.Utils.getShortAt(rawData, index, this.littleEndian);
  }

  this.intent_p1 = nifti$3.Utils.getFloatAt(rawData, 56, this.littleEndian);
  this.intent_p2 = nifti$3.Utils.getFloatAt(rawData, 60, this.littleEndian);
  this.intent_p3 = nifti$3.Utils.getFloatAt(rawData, 64, this.littleEndian);
  this.intent_code = nifti$3.Utils.getShortAt(rawData, 68, this.littleEndian);
  this.datatypeCode = nifti$3.Utils.getShortAt(rawData, 70, this.littleEndian);
  this.numBitsPerVoxel = nifti$3.Utils.getShortAt(rawData, 72, this.littleEndian);
  this.slice_start = nifti$3.Utils.getShortAt(rawData, 74, this.littleEndian);

  for (ctr = 0; ctr < 8; ctr += 1) {
    index = 76 + ctr * 4;
    this.pixDims[ctr] = nifti$3.Utils.getFloatAt(rawData, index, this.littleEndian);
  }

  this.vox_offset = nifti$3.Utils.getFloatAt(rawData, 108, this.littleEndian);
  this.scl_slope = nifti$3.Utils.getFloatAt(rawData, 112, this.littleEndian);
  this.scl_inter = nifti$3.Utils.getFloatAt(rawData, 116, this.littleEndian);
  this.slice_end = nifti$3.Utils.getShortAt(rawData, 120, this.littleEndian);
  this.slice_code = nifti$3.Utils.getByteAt(rawData, 122);
  this.xyzt_units = nifti$3.Utils.getByteAt(rawData, 123);
  this.cal_max = nifti$3.Utils.getFloatAt(rawData, 124, this.littleEndian);
  this.cal_min = nifti$3.Utils.getFloatAt(rawData, 128, this.littleEndian);
  this.slice_duration = nifti$3.Utils.getFloatAt(rawData, 132, this.littleEndian);
  this.toffset = nifti$3.Utils.getFloatAt(rawData, 136, this.littleEndian);
  this.description = nifti$3.Utils.getStringAt(rawData, 148, 228);
  this.aux_file = nifti$3.Utils.getStringAt(rawData, 228, 252);
  this.qform_code = nifti$3.Utils.getShortAt(rawData, 252, this.littleEndian);
  this.sform_code = nifti$3.Utils.getShortAt(rawData, 254, this.littleEndian);
  this.quatern_b = nifti$3.Utils.getFloatAt(rawData, 256, this.littleEndian);
  this.quatern_c = nifti$3.Utils.getFloatAt(rawData, 260, this.littleEndian);
  this.quatern_d = nifti$3.Utils.getFloatAt(rawData, 264, this.littleEndian);
  this.qoffset_x = nifti$3.Utils.getFloatAt(rawData, 268, this.littleEndian);
  this.qoffset_y = nifti$3.Utils.getFloatAt(rawData, 272, this.littleEndian);
  this.qoffset_z = nifti$3.Utils.getFloatAt(rawData, 276, this.littleEndian);

  for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
    for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
      index = 280 + (ctrOut * 4 + ctrIn) * 4;
      this.affine[ctrOut][ctrIn] = nifti$3.Utils.getFloatAt(rawData, index, this.littleEndian);
    }
  }

  this.affine[3][0] = 0;
  this.affine[3][1] = 0;
  this.affine[3][2] = 0;
  this.affine[3][3] = 1;
  this.intent_name = nifti$3.Utils.getStringAt(rawData, 328, 344);
  this.magic = nifti$3.Utils.getStringAt(rawData, 344, 348);
  this.isHDR = this.magic === nifti$3.NIFTI1.MAGIC_NUMBER2;

  if (rawData.byteLength > nifti$3.NIFTI1.MAGIC_COOKIE) {
    this.extensionFlag[0] = nifti$3.Utils.getByteAt(rawData, 348);
    this.extensionFlag[1] = nifti$3.Utils.getByteAt(rawData, 348 + 1);
    this.extensionFlag[2] = nifti$3.Utils.getByteAt(rawData, 348 + 2);
    this.extensionFlag[3] = nifti$3.Utils.getByteAt(rawData, 348 + 3);

    if (this.extensionFlag[0]) {
      this.extensionSize = this.getExtensionSize(rawData);
      this.extensionCode = this.getExtensionCode(rawData);
    }
  }
};
/**
 * Returns a formatted string of header fields.
 * @returns {string}
 */


nifti$3.NIFTI1.prototype.toFormattedString = function () {
  var fmt = nifti$3.Utils.formatNumber,
      string = '';
  string += 'Dim Info = ' + this.dim_info + '\n';
  string += 'Image Dimensions (1-8): ' + this.dims[0] + ', ' + this.dims[1] + ', ' + this.dims[2] + ', ' + this.dims[3] + ', ' + this.dims[4] + ', ' + this.dims[5] + ', ' + this.dims[6] + ', ' + this.dims[7] + '\n';
  string += 'Intent Parameters (1-3): ' + this.intent_p1 + ', ' + this.intent_p2 + ', ' + this.intent_p3 + '\n';
  string += 'Intent Code = ' + this.intent_code + '\n';
  string += 'Datatype = ' + this.datatypeCode + ' (' + this.getDatatypeCodeString(this.datatypeCode) + ')\n';
  string += 'Bits Per Voxel = ' + this.numBitsPerVoxel + '\n';
  string += 'Slice Start = ' + this.slice_start + '\n';
  string += 'Voxel Dimensions (1-8): ' + fmt(this.pixDims[0]) + ', ' + fmt(this.pixDims[1]) + ', ' + fmt(this.pixDims[2]) + ', ' + fmt(this.pixDims[3]) + ', ' + fmt(this.pixDims[4]) + ', ' + fmt(this.pixDims[5]) + ', ' + fmt(this.pixDims[6]) + ', ' + fmt(this.pixDims[7]) + '\n';
  string += 'Image Offset = ' + this.vox_offset + '\n';
  string += 'Data Scale:  Slope = ' + fmt(this.scl_slope) + '  Intercept = ' + fmt(this.scl_inter) + '\n';
  string += 'Slice End = ' + this.slice_end + '\n';
  string += 'Slice Code = ' + this.slice_code + '\n';
  string += 'Units Code = ' + this.xyzt_units + ' (' + this.getUnitsCodeString(nifti$3.NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ', ' + this.getUnitsCodeString(nifti$3.NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + ')\n';
  string += 'Display Range:  Max = ' + fmt(this.cal_max) + '  Min = ' + fmt(this.cal_min) + '\n';
  string += 'Slice Duration = ' + this.slice_duration + '\n';
  string += 'Time Axis Shift = ' + this.toffset + '\n';
  string += 'Description: "' + this.description + '"\n';
  string += 'Auxiliary File: "' + this.aux_file + '"\n';
  string += 'Q-Form Code = ' + this.qform_code + ' (' + this.getTransformCodeString(this.qform_code) + ')\n';
  string += 'S-Form Code = ' + this.sform_code + ' (' + this.getTransformCodeString(this.sform_code) + ')\n';
  string += 'Quaternion Parameters:  ' + 'b = ' + fmt(this.quatern_b) + '  ' + 'c = ' + fmt(this.quatern_c) + '  ' + 'd = ' + fmt(this.quatern_d) + '\n';
  string += 'Quaternion Offsets:  ' + 'x = ' + this.qoffset_x + '  ' + 'y = ' + this.qoffset_y + '  ' + 'z = ' + this.qoffset_z + '\n';
  string += 'S-Form Parameters X: ' + fmt(this.affine[0][0]) + ', ' + fmt(this.affine[0][1]) + ', ' + fmt(this.affine[0][2]) + ', ' + fmt(this.affine[0][3]) + '\n';
  string += 'S-Form Parameters Y: ' + fmt(this.affine[1][0]) + ', ' + fmt(this.affine[1][1]) + ', ' + fmt(this.affine[1][2]) + ', ' + fmt(this.affine[1][3]) + '\n';
  string += 'S-Form Parameters Z: ' + fmt(this.affine[2][0]) + ', ' + fmt(this.affine[2][1]) + ', ' + fmt(this.affine[2][2]) + ', ' + fmt(this.affine[2][3]) + '\n';
  string += 'Intent Name: "' + this.intent_name + '"\n';

  if (this.extensionFlag[0]) {
    string += 'Extension: Size = ' + this.extensionSize + '  Code = ' + this.extensionCode + '\n';
  }

  return string;
};
/**
 * Returns a human-readable string of datatype.
 * @param {number} code
 * @returns {string}
 */


nifti$3.NIFTI1.prototype.getDatatypeCodeString = function (code) {
  if (code === nifti$3.NIFTI1.TYPE_UINT8) {
    return '1-Byte Unsigned Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_INT16) {
    return '2-Byte Signed Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_INT32) {
    return '4-Byte Signed Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_FLOAT32) {
    return '4-Byte Float';
  } else if (code === nifti$3.NIFTI1.TYPE_FLOAT64) {
    return '8-Byte Float';
  } else if (code === nifti$3.NIFTI1.TYPE_RGB24) {
    return 'RGB';
  } else if (code === nifti$3.NIFTI1.TYPE_INT8) {
    return '1-Byte Signed Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_UINT16) {
    return '2-Byte Unsigned Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_UINT32) {
    return '4-Byte Unsigned Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_INT64) {
    return '8-Byte Signed Integer';
  } else if (code === nifti$3.NIFTI1.TYPE_UINT64) {
    return '8-Byte Unsigned Integer';
  } else {
    return 'Unknown';
  }
};
/**
 * Returns a human-readable string of transform type.
 * @param {number} code
 * @returns {string}
 */


nifti$3.NIFTI1.prototype.getTransformCodeString = function (code) {
  if (code === nifti$3.NIFTI1.XFORM_SCANNER_ANAT) {
    return 'Scanner';
  } else if (code === nifti$3.NIFTI1.XFORM_ALIGNED_ANAT) {
    return 'Aligned';
  } else if (code === nifti$3.NIFTI1.XFORM_TALAIRACH) {
    return 'Talairach';
  } else if (code === nifti$3.NIFTI1.XFORM_MNI_152) {
    return 'MNI';
  } else {
    return 'Unknown';
  }
};
/**
 * Returns a human-readable string of spatial and temporal units.
 * @param {number} code
 * @returns {string}
 */


nifti$3.NIFTI1.prototype.getUnitsCodeString = function (code) {
  if (code === nifti$3.NIFTI1.UNITS_METER) {
    return 'Meters';
  } else if (code === nifti$3.NIFTI1.UNITS_MM) {
    return 'Millimeters';
  } else if (code === nifti$3.NIFTI1.UNITS_MICRON) {
    return 'Microns';
  } else if (code === nifti$3.NIFTI1.UNITS_SEC) {
    return 'Seconds';
  } else if (code === nifti$3.NIFTI1.UNITS_MSEC) {
    return 'Milliseconds';
  } else if (code === nifti$3.NIFTI1.UNITS_USEC) {
    return 'Microseconds';
  } else if (code === nifti$3.NIFTI1.UNITS_HZ) {
    return 'Hz';
  } else if (code === nifti$3.NIFTI1.UNITS_PPM) {
    return 'PPM';
  } else if (code === nifti$3.NIFTI1.UNITS_RADS) {
    return 'Rads';
  } else {
    return 'Unknown';
  }
};
/**
 * Returns the qform matrix.
 * @returns {Array.<Array.<number>>}
 */


nifti$3.NIFTI1.prototype.getQformMat = function () {
  return this.convertNiftiQFormToNiftiSForm(this.quatern_b, this.quatern_c, this.quatern_d, this.qoffset_x, this.qoffset_y, this.qoffset_z, this.pixDims[1], this.pixDims[2], this.pixDims[3], this.pixDims[0]);
};
/**
 * Converts qform to an affine.  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
 * @param {number} qb
 * @param {number} qc
 * @param {number} qd
 * @param {number} qx
 * @param {number} qy
 * @param {number} qz
 * @param {number} dx
 * @param {number} dy
 * @param {number} dz
 * @param {number} qfac
 * @returns {Array.<Array.<number>>}
 */


nifti$3.NIFTI1.prototype.convertNiftiQFormToNiftiSForm = function (qb, qc, qd, qx, qy, qz, dx, dy, dz, qfac) {
  var R = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      a,
      b = qb,
      c = qc,
      d = qd,
      xd,
      yd,
      zd; // last row is always [ 0 0 0 1 ]

  R[3][0] = R[3][1] = R[3][2] = 0.0;
  R[3][3] = 1.0; // compute a parameter from b,c,d

  a = 1.0 - (b * b + c * c + d * d);

  if (a < 0.0000001) {
    /* special case */
    a = 1.0 / Math.sqrt(b * b + c * c + d * d);
    b *= a;
    c *= a;
    d *= a;
    /* normalize (b,c,d) vector */

    a = 0.0;
    /* a = 0 ==> 180 degree rotation */
  } else {
    a = Math.sqrt(a);
    /* angle = 2*arccos(a) */
  } // load rotation matrix, including scaling factors for voxel sizes


  xd = dx > 0.0 ? dx : 1.0;
  /* make sure are positive */

  yd = dy > 0.0 ? dy : 1.0;
  zd = dz > 0.0 ? dz : 1.0;

  if (qfac < 0.0) {
    zd = -zd;
    /* left handedness? */
  }

  R[0][0] = (a * a + b * b - c * c - d * d) * xd;
  R[0][1] = 2.0 * (b * c - a * d) * yd;
  R[0][2] = 2.0 * (b * d + a * c) * zd;
  R[1][0] = 2.0 * (b * c + a * d) * xd;
  R[1][1] = (a * a + c * c - b * b - d * d) * yd;
  R[1][2] = 2.0 * (c * d - a * b) * zd;
  R[2][0] = 2.0 * (b * d - a * c) * xd;
  R[2][1] = 2.0 * (c * d + a * b) * yd;
  R[2][2] = (a * a + d * d - c * c - b * b) * zd; // load offsets

  R[0][3] = qx;
  R[1][3] = qy;
  R[2][3] = qz;
  return R;
};
/**
 * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
 * @param {Array.<Array.<number>>} R
 * @returns {string}
 */


nifti$3.NIFTI1.prototype.convertNiftiSFormToNEMA = function (R) {
  var xi, xj, xk, yi, yj, yk, zi, zj, zk, val, detQ, detP, i, j, k, p, q, r, ibest, jbest, kbest, pbest, qbest, rbest, M, vbest, Q, P, iChar, jChar, kChar, iSense, jSense, kSense;
  k = 0;
  Q = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  P = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  /*-- j axis --*/

  /*-- k axis --*/
  //if( icod == NULL || jcod == NULL || kcod == NULL ) return ; /* bad */
  //*icod = *jcod = *kcod = 0 ; /* this.errorMessage returns, if sh*t happens */

  /* load column vectors for each (i,j,k) direction from matrix */

  /*-- i axis --*/

  xi = R[0][0];
  xj = R[0][1];
  xk = R[0][2];
  yi = R[1][0];
  yj = R[1][1];
  yk = R[1][2];
  zi = R[2][0];
  zj = R[2][1];
  zk = R[2][2];
  /* normalize column vectors to get unit vectors along each ijk-axis */

  /* normalize i axis */

  val = Math.sqrt(xi * xi + yi * yi + zi * zi);

  if (val === 0.0) {
    /* stupid input */
    return null;
  }

  xi /= val;
  yi /= val;
  zi /= val;
  /* normalize j axis */

  val = Math.sqrt(xj * xj + yj * yj + zj * zj);

  if (val === 0.0) {
    /* stupid input */
    return null;
  }

  xj /= val;
  yj /= val;
  zj /= val;
  /* orthogonalize j axis to i axis, if needed */

  val = xi * xj + yi * yj + zi * zj;
  /* dot product between i and j */

  if (Math.abs(val) > 1e-4) {
    xj -= val * xi;
    yj -= val * yi;
    zj -= val * zi;
    val = Math.sqrt(xj * xj + yj * yj + zj * zj);
    /* must renormalize */

    if (val === 0.0) {
      /* j was parallel to i? */
      return null;
    }

    xj /= val;
    yj /= val;
    zj /= val;
  }
  /* normalize k axis; if it is zero, make it the cross product i x j */


  val = Math.sqrt(xk * xk + yk * yk + zk * zk);

  if (val === 0.0) {
    xk = yi * zj - zi * yj;
    yk = zi * xj - zj * xi;
    zk = xi * yj - yi * xj;
  } else {
    xk /= val;
    yk /= val;
    zk /= val;
  }
  /* orthogonalize k to i */


  val = xi * xk + yi * yk + zi * zk;
  /* dot product between i and k */

  if (Math.abs(val) > 1e-4) {
    xk -= val * xi;
    yk -= val * yi;
    zk -= val * zi;
    val = Math.sqrt(xk * xk + yk * yk + zk * zk);

    if (val === 0.0) {
      /* bad */
      return null;
    }

    xk /= val;
    yk /= val;
    zk /= val;
  }
  /* orthogonalize k to j */


  val = xj * xk + yj * yk + zj * zk;
  /* dot product between j and k */

  if (Math.abs(val) > 1e-4) {
    xk -= val * xj;
    yk -= val * yj;
    zk -= val * zj;
    val = Math.sqrt(xk * xk + yk * yk + zk * zk);

    if (val === 0.0) {
      /* bad */
      return null;
    }

    xk /= val;
    yk /= val;
    zk /= val;
  }

  Q[0][0] = xi;
  Q[0][1] = xj;
  Q[0][2] = xk;
  Q[1][0] = yi;
  Q[1][1] = yj;
  Q[1][2] = yk;
  Q[2][0] = zi;
  Q[2][1] = zj;
  Q[2][2] = zk;
  /* at this point, Q is the rotation matrix from the (i,j,k) to (x,y,z) axes */

  detQ = this.nifti_mat33_determ(Q);

  if (detQ === 0.0) {
    /* shouldn't happen unless user is a DUFIS */
    return null;
  }
  /* Build and test all possible +1/-1 coordinate permutation matrices P;
     then find the P such that the rotation matrix M=PQ is closest to the
     identity, in the sense of M having the smallest total rotation angle. */

  /* Despite the formidable looking 6 nested loops, there are
     only 3*3*3*2*2*2 = 216 passes, which will run very quickly. */


  vbest = -666.0;
  ibest = pbest = qbest = rbest = 1;
  jbest = 2;
  kbest = 3;

  for (i = 1; i <= 3; i += 1) {
    /* i = column number to use for row #1 */
    for (j = 1; j <= 3; j += 1) {
      /* j = column number to use for row #2 */
      if (i !== j) {
        for (k = 1; k <= 3; k += 1) {
          /* k = column number to use for row #3 */
          if (!(i === k || j === k)) {
            P[0][0] = P[0][1] = P[0][2] = P[1][0] = P[1][1] = P[1][2] = P[2][0] = P[2][1] = P[2][2] = 0.0;

            for (p = -1; p <= 1; p += 2) {
              /* p,q,r are -1 or +1      */
              for (q = -1; q <= 1; q += 2) {
                /* and go into rows #1,2,3 */
                for (r = -1; r <= 1; r += 2) {
                  P[0][i - 1] = p;
                  P[1][j - 1] = q;
                  P[2][k - 1] = r;
                  detP = this.nifti_mat33_determ(P);
                  /* sign of permutation */

                  if (detP * detQ > 0.0) {
                    M = this.nifti_mat33_mul(P, Q);
                    /* angle of M rotation = 2.0*acos(0.5*sqrt(1.0+trace(M)))       */

                    /* we want largest trace(M) == smallest angle == M nearest to I */

                    val = M[0][0] + M[1][1] + M[2][2];
                    /* trace */

                    if (val > vbest) {
                      vbest = val;
                      ibest = i;
                      jbest = j;
                      kbest = k;
                      pbest = p;
                      qbest = q;
                      rbest = r;
                    }
                  }
                  /* doesn't match sign of Q */

                }
              }
            }
          }
        }
      }
    }
  }
  /* At this point ibest is 1 or 2 or 3; pbest is -1 or +1; etc.
      The matrix P that corresponds is the best permutation approximation
     to Q-inverse; that is, P (approximately) takes (x,y,z) coordinates
     to the (i,j,k) axes.
      For example, the first row of P (which contains pbest in column ibest)
     determines the way the i axis points relative to the anatomical
     (x,y,z) axes.  If ibest is 2, then the i axis is along the y axis,
     which is direction P2A (if pbest > 0) or A2P (if pbest < 0).
      So, using ibest and pbest, we can assign the output code for
     the i axis.  Mutatis mutandis for the j and k axes, of course. */


  iChar = jChar = kChar = iSense = jSense = kSense = 0;

  switch (ibest * pbest) {
    case 1
    /*i = NIFTI_L2R*/
    :
      iChar = 'X';
      iSense = '+';
      break;

    case -1
    /*i = NIFTI_R2L*/
    :
      iChar = 'X';
      iSense = '-';
      break;

    case 2
    /*i = NIFTI_P2A*/
    :
      iChar = 'Y';
      iSense = '+';
      break;

    case -2
    /*i = NIFTI_A2P*/
    :
      iChar = 'Y';
      iSense = '-';
      break;

    case 3
    /*i = NIFTI_I2S*/
    :
      iChar = 'Z';
      iSense = '+';
      break;

    case -3
    /*i = NIFTI_S2I*/
    :
      iChar = 'Z';
      iSense = '-';
      break;
  }

  switch (jbest * qbest) {
    case 1
    /*j = NIFTI_L2R*/
    :
      jChar = 'X';
      jSense = '+';
      break;

    case -1
    /*j = NIFTI_R2L*/
    :
      jChar = 'X';
      jSense = '-';
      break;

    case 2
    /*j = NIFTI_P2A*/
    :
      jChar = 'Y';
      jSense = '+';
      break;

    case -2
    /*j = NIFTI_A2P*/
    :
      jChar = 'Y';
      jSense = '-';
      break;

    case 3
    /*j = NIFTI_I2S*/
    :
      jChar = 'Z';
      jSense = '+';
      break;

    case -3
    /*j = NIFTI_S2I*/
    :
      jChar = 'Z';
      jSense = '-';
      break;
  }

  switch (kbest * rbest) {
    case 1
    /*k = NIFTI_L2R*/
    :
      kChar = 'X';
      kSense = '+';
      break;

    case -1
    /*k = NIFTI_R2L*/
    :
      kChar = 'X';
      kSense = '-';
      break;

    case 2
    /*k = NIFTI_P2A*/
    :
      kChar = 'Y';
      kSense = '+';
      break;

    case -2
    /*k = NIFTI_A2P*/
    :
      kChar = 'Y';
      kSense = '-';
      break;

    case 3
    /*k = NIFTI_I2S*/
    :
      kChar = 'Z';
      kSense = '+';
      break;

    case -3
    /*k = NIFTI_S2I*/
    :
      kChar = 'Z';
      kSense = '-';
      break;
  }

  return iChar + jChar + kChar + iSense + jSense + kSense;
};

nifti$3.NIFTI1.prototype.nifti_mat33_mul = function (A, B) {
  var C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      i,
      j;

  for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
      C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
    }
  }

  return C;
};

nifti$3.NIFTI1.prototype.nifti_mat33_determ = function (R) {
  var r11, r12, r13, r21, r22, r23, r31, r32, r33;
  /*  INPUT MATRIX:  */

  r11 = R[0][0];
  r12 = R[0][1];
  r13 = R[0][2];
  r21 = R[1][0];
  r22 = R[1][1];
  r23 = R[1][2];
  r31 = R[2][0];
  r32 = R[2][1];
  r33 = R[2][2];
  return r11 * r22 * r33 - r11 * r32 * r23 - r21 * r12 * r33 + r21 * r32 * r13 + r31 * r12 * r23 - r31 * r22 * r13;
};
/**
 * Returns the byte index of the extension.
 * @returns {number}
 */


nifti$3.NIFTI1.prototype.getExtensionLocation = function () {
  return nifti$3.NIFTI1.MAGIC_COOKIE + 4;
};
/**
 * Returns the extension size.
 * @param {DataView} data
 * @returns {number}
 */


nifti$3.NIFTI1.prototype.getExtensionSize = function (data) {
  return nifti$3.Utils.getIntAt(data, this.getExtensionLocation(), this.littleEndian);
};
/**
 * Returns the extension code.
 * @param {DataView} data
 * @returns {number}
 */


nifti$3.NIFTI1.prototype.getExtensionCode = function (data) {
  return nifti$3.Utils.getIntAt(data, this.getExtensionLocation() + 4, this.littleEndian);
};
/*** Exports ***/


var moduleType$2 = typeof module$2;

if (moduleType$2 !== 'undefined' && module$2.exports) {
  module$2.exports = nifti$3.NIFTI1;
}

var _nifti1Js = module$2.exports;

/*jslint browser: true, node: true */
var module$1 = {
  exports: {}
};
var nifti$2 = nifti$2 || {};
nifti$2.Utils = nifti$2.Utils || _utilitiesJs;
nifti$2.NIFTI1 = nifti$2.NIFTI1 || _nifti1Js;
/*** Constructor ***/

/**
 * The NIFTI2 constructor.
 * @constructor
 * @property {boolean} littleEndian
 * @property {number} dim_info
 * @property {number[]} dims - image dimensions
 * @property {number} intent_p1
 * @property {number} intent_p2
 * @property {number} intent_p3
 * @property {number} intent_code
 * @property {number} datatypeCode
 * @property {number} numBitsPerVoxel
 * @property {number} slice_start
 * @property {number} slice_end
 * @property {number} slice_code
 * @property {number[]} pixDims - voxel dimensions
 * @property {number} vox_offset
 * @property {number} scl_slope
 * @property {number} scl_inter
 * @property {number} xyzt_units
 * @property {number} cal_max
 * @property {number} cal_min
 * @property {number} slice_duration
 * @property {number} toffset
 * @property {string} description
 * @property {string} aux_file
 * @property {string} intent_name
 * @property {number} qform_code
 * @property {number} sform_code
 * @property {number} quatern_b
 * @property {number} quatern_c
 * @property {number} quatern_d
 * @property {number} quatern_x
 * @property {number} quatern_y
 * @property {number} quatern_z
 * @property {Array.<Array.<number>>} affine
 * @property {string} magic
 * @property {number[]} extensionFlag
 * @type {Function}
 */

nifti$2.NIFTI2 = nifti$2.NIFTI2 || function () {
  this.littleEndian = false;
  this.dim_info = 0;
  this.dims = [];
  this.intent_p1 = 0;
  this.intent_p2 = 0;
  this.intent_p3 = 0;
  this.intent_code = 0;
  this.datatypeCode = 0;
  this.numBitsPerVoxel = 0;
  this.slice_start = 0;
  this.slice_end = 0;
  this.slice_code = 0;
  this.pixDims = [];
  this.vox_offset = 0;
  this.scl_slope = 1;
  this.scl_inter = 0;
  this.xyzt_units = 0;
  this.cal_max = 0;
  this.cal_min = 0;
  this.slice_duration = 0;
  this.toffset = 0;
  this.description = '';
  this.aux_file = '';
  this.intent_name = '';
  this.qform_code = 0;
  this.sform_code = 0;
  this.quatern_b = 0;
  this.quatern_c = 0;
  this.quatern_d = 0;
  this.qoffset_x = 0;
  this.qoffset_y = 0;
  this.qoffset_z = 0;
  this.affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  this.magic = 0;
  this.extensionFlag = [0, 0, 0, 0];
};
/*** Static Pseudo-constants ***/


nifti$2.NIFTI2.MAGIC_COOKIE = 540;
nifti$2.NIFTI2.MAGIC_NUMBER_LOCATION = 4;
nifti$2.NIFTI2.MAGIC_NUMBER = [0x6e, 0x2b, 0x32, 0, 0x0d, 0x0a, 0x1a, 0x0a]; // n+2\0

/*** Prototype Methods ***/

/**
 * Reads the header data.
 * @param {ArrayBuffer} data
 */

nifti$2.NIFTI2.prototype.readHeader = function (data) {
  var rawData = new DataView(data),
      magicCookieVal = nifti$2.Utils.getIntAt(rawData, 0, this.littleEndian),
      ctr,
      ctrOut,
      ctrIn,
      index;

  if (magicCookieVal !== nifti$2.NIFTI2.MAGIC_COOKIE) {
    // try as little endian
    this.littleEndian = true;
    magicCookieVal = nifti$2.Utils.getIntAt(rawData, 0, this.littleEndian);
  }

  if (magicCookieVal !== nifti$2.NIFTI2.MAGIC_COOKIE) {
    throw new Error('This does not appear to be a NIFTI file!');
  }

  this.datatypeCode = nifti$2.Utils.getShortAt(rawData, 12, this.littleEndian);
  this.numBitsPerVoxel = nifti$2.Utils.getShortAt(rawData, 14, this.littleEndian);

  for (ctr = 0; ctr < 8; ctr += 1) {
    index = 16 + ctr * 8;
    this.dims[ctr] = nifti$2.Utils.getLongAt(rawData, index, this.littleEndian);
  }

  this.intent_p1 = nifti$2.Utils.getDoubleAt(rawData, 80, this.littleEndian);
  this.intent_p2 = nifti$2.Utils.getDoubleAt(rawData, 88, this.littleEndian);
  this.intent_p3 = nifti$2.Utils.getDoubleAt(rawData, 96, this.littleEndian);

  for (ctr = 0; ctr < 8; ctr += 1) {
    index = 104 + ctr * 8;
    this.pixDims[ctr] = nifti$2.Utils.getDoubleAt(rawData, index, this.littleEndian);
  }

  this.vox_offset = nifti$2.Utils.getLongAt(rawData, 168, this.littleEndian);
  this.scl_slope = nifti$2.Utils.getDoubleAt(rawData, 176, this.littleEndian);
  this.scl_inter = nifti$2.Utils.getDoubleAt(rawData, 184, this.littleEndian);
  this.cal_max = nifti$2.Utils.getDoubleAt(rawData, 192, this.littleEndian);
  this.cal_min = nifti$2.Utils.getDoubleAt(rawData, 200, this.littleEndian);
  this.slice_duration = nifti$2.Utils.getDoubleAt(rawData, 208, this.littleEndian);
  this.toffset = nifti$2.Utils.getDoubleAt(rawData, 216, this.littleEndian);
  this.slice_start = nifti$2.Utils.getLongAt(rawData, 224, this.littleEndian);
  this.slice_end = nifti$2.Utils.getLongAt(rawData, 232, this.littleEndian);
  this.description = nifti$2.Utils.getStringAt(rawData, 240, 240 + 80);
  this.aux_file = nifti$2.Utils.getStringAt(rawData, 320, 320 + 24);
  this.qform_code = nifti$2.Utils.getIntAt(rawData, 344, this.littleEndian);
  this.sform_code = nifti$2.Utils.getIntAt(rawData, 348, this.littleEndian);
  this.quatern_b = nifti$2.Utils.getDoubleAt(rawData, 352, this.littleEndian);
  this.quatern_c = nifti$2.Utils.getDoubleAt(rawData, 360, this.littleEndian);
  this.quatern_d = nifti$2.Utils.getDoubleAt(rawData, 368, this.littleEndian);
  this.qoffset_x = nifti$2.Utils.getDoubleAt(rawData, 376, this.littleEndian);
  this.qoffset_y = nifti$2.Utils.getDoubleAt(rawData, 384, this.littleEndian);
  this.qoffset_z = nifti$2.Utils.getDoubleAt(rawData, 392, this.littleEndian);

  for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
    for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
      index = 400 + (ctrOut * 4 + ctrIn) * 8;
      this.affine[ctrOut][ctrIn] = nifti$2.Utils.getDoubleAt(rawData, index, this.littleEndian);
    }
  }

  this.affine[3][0] = 0;
  this.affine[3][1] = 0;
  this.affine[3][2] = 0;
  this.affine[3][3] = 1;
  this.slice_code = nifti$2.Utils.getIntAt(rawData, 496, this.littleEndian);
  this.xyzt_units = nifti$2.Utils.getIntAt(rawData, 500, this.littleEndian);
  this.intent_code = nifti$2.Utils.getIntAt(rawData, 504, this.littleEndian);
  this.intent_name = nifti$2.Utils.getStringAt(rawData, 508, 508 + 16);
  this.dim_info = nifti$2.Utils.getByteAt(rawData, 524);

  if (rawData.byteLength > nifti$2.NIFTI2.MAGIC_COOKIE) {
    this.extensionFlag[0] = nifti$2.Utils.getByteAt(rawData, 540);
    this.extensionFlag[1] = nifti$2.Utils.getByteAt(rawData, 540 + 1);
    this.extensionFlag[2] = nifti$2.Utils.getByteAt(rawData, 540 + 2);
    this.extensionFlag[3] = nifti$2.Utils.getByteAt(rawData, 540 + 3);

    if (this.extensionFlag[0]) {
      this.extensionSize = this.getExtensionSize(rawData);
      this.extensionCode = this.getExtensionCode(rawData);
    }
  }
};
/**
 * Returns a formatted string of header fields.
 * @returns {string}
 */


nifti$2.NIFTI2.prototype.toFormattedString = function () {
  var fmt = nifti$2.Utils.formatNumber,
      string = '';
  string += 'Datatype = ' + +this.datatypeCode + ' (' + this.getDatatypeCodeString(this.datatypeCode) + ')\n';
  string += 'Bits Per Voxel = ' + ' = ' + this.numBitsPerVoxel + '\n';
  string += 'Image Dimensions' + ' (1-8): ' + this.dims[0] + ', ' + this.dims[1] + ', ' + this.dims[2] + ', ' + this.dims[3] + ', ' + this.dims[4] + ', ' + this.dims[5] + ', ' + this.dims[6] + ', ' + this.dims[7] + '\n';
  string += 'Intent Parameters (1-3): ' + this.intent_p1 + ', ' + this.intent_p2 + ', ' + this.intent_p3 + '\n';
  string += 'Voxel Dimensions (1-8): ' + fmt(this.pixDims[0]) + ', ' + fmt(this.pixDims[1]) + ', ' + fmt(this.pixDims[2]) + ', ' + fmt(this.pixDims[3]) + ', ' + fmt(this.pixDims[4]) + ', ' + fmt(this.pixDims[5]) + ', ' + fmt(this.pixDims[6]) + ', ' + fmt(this.pixDims[7]) + '\n';
  string += 'Image Offset = ' + this.vox_offset + '\n';
  string += 'Data Scale:  Slope = ' + fmt(this.scl_slope) + '  Intercept = ' + fmt(this.scl_inter) + '\n';
  string += 'Display Range:  Max = ' + fmt(this.cal_max) + '  Min = ' + fmt(this.cal_min) + '\n';
  string += 'Slice Duration = ' + this.slice_duration + '\n';
  string += 'Time Axis Shift = ' + this.toffset + '\n';
  string += 'Slice Start = ' + this.slice_start + '\n';
  string += 'Slice End = ' + this.slice_end + '\n';
  string += 'Description: "' + this.description + '"\n';
  string += 'Auxiliary File: "' + this.aux_file + '"\n';
  string += 'Q-Form Code = ' + this.qform_code + ' (' + this.getTransformCodeString(this.qform_code) + ')\n';
  string += 'S-Form Code = ' + this.sform_code + ' (' + this.getTransformCodeString(this.sform_code) + ')\n';
  string += 'Quaternion Parameters:  ' + 'b = ' + fmt(this.quatern_b) + '  ' + 'c = ' + fmt(this.quatern_c) + '  ' + 'd = ' + fmt(this.quatern_d) + '\n';
  string += 'Quaternion Offsets:  ' + 'x = ' + this.qoffset_x + '  ' + 'y = ' + this.qoffset_y + '  ' + 'z = ' + this.qoffset_z + '\n';
  string += 'S-Form Parameters X: ' + fmt(this.affine[0][0]) + ', ' + fmt(this.affine[0][1]) + ', ' + fmt(this.affine[0][2]) + ', ' + fmt(this.affine[0][3]) + '\n';
  string += 'S-Form Parameters Y: ' + fmt(this.affine[1][0]) + ', ' + fmt(this.affine[1][1]) + ', ' + fmt(this.affine[1][2]) + ', ' + fmt(this.affine[1][3]) + '\n';
  string += 'S-Form Parameters Z: ' + fmt(this.affine[2][0]) + ', ' + fmt(this.affine[2][1]) + ', ' + fmt(this.affine[2][2]) + ', ' + fmt(this.affine[2][3]) + '\n';
  string += 'Slice Code = ' + this.slice_code + '\n';
  string += 'Units Code = ' + this.xyzt_units + ' (' + this.getUnitsCodeString(nifti$2.NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ', ' + this.getUnitsCodeString(nifti$2.NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + ')\n';
  string += 'Intent Code = ' + this.intent_code + '\n';
  string += 'Intent Name: "' + this.intent_name + '"\n';
  string += 'Dim Info = ' + this.dim_info + '\n';
  return string;
};
/**
 * Returns the byte index of the extension.
 * @returns {number}
 */


nifti$2.NIFTI2.prototype.getExtensionLocation = function () {
  return nifti$2.NIFTI2.MAGIC_COOKIE + 4;
};
/**
 * Returns the extension size.
 * @param {DataView} data
 * @returns {number}
 */


nifti$2.NIFTI2.prototype.getExtensionSize = nifti$2.NIFTI1.prototype.getExtensionSize;
/**
 * Returns the extension code.
 * @param {DataView} data
 * @returns {number}
 */

nifti$2.NIFTI2.prototype.getExtensionCode = nifti$2.NIFTI1.prototype.getExtensionCode;
/**
 * Returns a human-readable string of datatype.
 * @param {number} code
 * @returns {string}
 */

nifti$2.NIFTI2.prototype.getDatatypeCodeString = nifti$2.NIFTI1.prototype.getDatatypeCodeString;
/**
 * Returns a human-readable string of transform type.
 * @param {number} code
 * @returns {string}
 */

nifti$2.NIFTI2.prototype.getTransformCodeString = nifti$2.NIFTI1.prototype.getTransformCodeString;
/**
 * Returns a human-readable string of spatial and temporal units.
 * @param {number} code
 * @returns {string}
 */

nifti$2.NIFTI2.prototype.getUnitsCodeString = nifti$2.NIFTI1.prototype.getUnitsCodeString;
/**
 * Returns the qform matrix.
 * @returns {Array.<Array.<number>>}
 */

nifti$2.NIFTI2.prototype.getQformMat = nifti$2.NIFTI1.prototype.getQformMat;
/**
 * Converts qform to an affine.  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
 * @param {number} qb
 * @param {number} qc
 * @param {number} qd
 * @param {number} qx
 * @param {number} qy
 * @param {number} qz
 * @param {number} dx
 * @param {number} dy
 * @param {number} dz
 * @param {number} qfac
 * @returns {Array.<Array.<number>>}
 */

nifti$2.NIFTI2.prototype.convertNiftiQFormToNiftiSForm = nifti$2.NIFTI1.prototype.convertNiftiQFormToNiftiSForm;
/**
 * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
 * @param {Array.<Array.<number>>} R
 * @returns {string}
 */

nifti$2.NIFTI2.prototype.convertNiftiSFormToNEMA = nifti$2.NIFTI1.prototype.convertNiftiSFormToNEMA;
nifti$2.NIFTI2.prototype.nifti_mat33_mul = nifti$2.NIFTI1.prototype.nifti_mat33_mul;
nifti$2.NIFTI2.prototype.nifti_mat33_determ = nifti$2.NIFTI1.prototype.nifti_mat33_determ;
/*** Exports ***/

var moduleType$1 = typeof module$1;

if (moduleType$1 !== 'undefined' && module$1.exports) {
  module$1.exports = nifti$2.NIFTI2;
}

var _nifti2Js = module$1.exports;

/*jslint browser: true, node: true */
var module = {
  exports: {}
};
var nifti = nifti || {};
nifti.NIFTI1 = nifti.NIFTI1 || _nifti1Js;
nifti.NIFTI2 = nifti.NIFTI2 || _nifti2Js;
nifti.Utils = nifti.Utils || _utilitiesJs;
var pako = pako || (typeof require !== 'undefined' ? _pako : null);
/*** Static Methods ***/

/**
 * Returns true if this data represents a NIFTI-1 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */

nifti.isNIFTI1 = function (data) {
  var buf, mag1, mag2, mag3;

  if (data.byteLength < nifti.NIFTI1.STANDARD_HEADER_SIZE) {
    return false;
  }

  buf = new DataView(data);
  if (buf) mag1 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION);
  mag2 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION + 1);
  mag3 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION + 2);
  return !!(mag1 === nifti.NIFTI1.MAGIC_NUMBER[0] && mag2 === nifti.NIFTI1.MAGIC_NUMBER[1] && mag3 === nifti.NIFTI1.MAGIC_NUMBER[2]);
};
/**
 * Returns true if this data represents a NIFTI-2 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */


nifti.isNIFTI2 = function (data) {
  var buf, mag1, mag2, mag3;

  if (data.byteLength < nifti.NIFTI1.STANDARD_HEADER_SIZE) {
    return false;
  }

  buf = new DataView(data);
  mag1 = buf.getUint8(nifti.NIFTI2.MAGIC_NUMBER_LOCATION);
  mag2 = buf.getUint8(nifti.NIFTI2.MAGIC_NUMBER_LOCATION + 1);
  mag3 = buf.getUint8(nifti.NIFTI2.MAGIC_NUMBER_LOCATION + 2);
  return !!(mag1 === nifti.NIFTI2.MAGIC_NUMBER[0] && mag2 === nifti.NIFTI2.MAGIC_NUMBER[1] && mag3 === nifti.NIFTI2.MAGIC_NUMBER[2]);
};
/**
 * Returns true if this data represents a NIFTI header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */


nifti.isNIFTI = function (data) {
  return nifti.isNIFTI1(data) || nifti.isNIFTI2(data);
};
/**
 * Returns true if this data is GZIP compressed.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */


nifti.isCompressed = function (data) {
  var buf, magicCookie1, magicCookie2;

  if (data) {
    buf = new DataView(data);
    magicCookie1 = buf.getUint8(0);
    magicCookie2 = buf.getUint8(1);

    if (magicCookie1 === nifti.Utils.GUNZIP_MAGIC_COOKIE1) {
      return true;
    }

    if (magicCookie2 === nifti.Utils.GUNZIP_MAGIC_COOKIE2) {
      return true;
    }
  }

  return false;
};
/**
 * Returns decompressed data.
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */


nifti.decompress = function (data) {
  return pako.inflate(data).buffer;
};
/**
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {nifti.NIFTI1|nifti.NIFTI2|null}
 */


nifti.readHeader = function (data) {
  var header = null;

  if (nifti.isCompressed(data)) {
    data = nifti.decompress(data);
  }

  if (nifti.isNIFTI1(data)) {
    header = new nifti.NIFTI1();
  } else if (nifti.isNIFTI2(data)) {
    header = new nifti.NIFTI2();
  }

  if (header) {
    header.readHeader(data);
  } else {
    console.error('That file does not appear to be NIFTI!');
  }

  return header;
};
/**
 * Returns true if this header contains an extension.
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @returns {boolean}
 */


nifti.hasExtension = function (header) {
  return header.extensionFlag[0] != 0;
};
/**
 * Returns the image data.
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */


nifti.readImage = function (header, data) {
  var imageOffset = header.vox_offset,
      timeDim = 1,
      statDim = 1;

  if (header.dims[4]) {
    timeDim = header.dims[4];
  }

  if (header.dims[5]) {
    statDim = header.dims[5];
  }

  var imageSize = header.dims[1] * header.dims[2] * header.dims[3] * timeDim * statDim * (header.numBitsPerVoxel / 8);
  return data.slice(imageOffset, imageOffset + imageSize);
};
/**
 * Returns the extension data (including extension header).
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */


nifti.readExtension = function (header, data) {
  var loc = header.getExtensionLocation(),
      size = header.extensionSize;
  return data.slice(loc, loc + size);
};
/**
 * Returns the extension data.
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */


nifti.readExtensionData = function (header, data) {
  var loc = header.getExtensionLocation(),
      size = header.extensionSize;
  return data.slice(loc + 8, loc + size - 8);
};
/*** Exports ***/


var moduleType = typeof module;

if (moduleType !== 'undefined' && module.exports) {
  module.exports = nifti;
}

var nifti$1 = module.exports;

export default nifti$1;
