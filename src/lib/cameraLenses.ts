/**
 * 摄影镜头数据库
 * 数据来源：各品牌官方规格页 + DPReview / EISA 权威摄影评测库
 * 所有型号均为真实量产镜头，无虚构数据
 */

// ===================== 数据类型 =====================
export interface LensSpec {
  /** 唯一标识，用于联动映射 */
  id: string;
  /** 完整型号名称（与官方一致） */
  name: string;
  /** 品牌名 */
  brand: string;
  /** 适配卡口/系统（用于联动筛选） */
  mount: string;
  /** 焦距描述，如 "50mm" / "24-70mm" */
  focalLength: string;
  /** 焦距数值（定焦取整数，变焦取最小焦段） */
  focalLengthMin: number;
  /** 焦距数值（定焦 = focalLengthMin，变焦取最大焦段） */
  focalLengthMax: number;
  /** 最大光圈，如 "f/1.4" */
  maxAperture: string;
  /** 最大光圈数值（越小越大） */
  maxApertureValue: number;
  /** 典型用途标签 */
  tags: string[];
}

// ===================== 镜头分组 =====================
export interface LensGroup {
  brand: string;
  mountLabel: string;
  lenses: LensSpec[];
}

// ===================== 完整镜头数据库 =====================
export const LENS_DATABASE: LensSpec[] = [
  // ── 徕卡 Leica M卡口 ─────────────────────────────────────────────────
  {
    id: 'leica-summilux-m-35-1.4',
    name: 'Summilux-M 35mm f/1.4 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['街头', '人文', '人像'],
  },
  {
    id: 'leica-summilux-m-50-1.4',
    name: 'Summilux-M 50mm f/1.4 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '街头', '纪实'],
  },
  {
    id: 'leica-summicron-m-50-2',
    name: 'Summicron-M 50mm f/2 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['街头', '旅行', '纪实'],
  },
  {
    id: 'leica-apo-summicron-m-50-2',
    name: 'APO-Summicron-M 50mm f/2 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['商业', '人像', '高画质'],
  },
  {
    id: 'leica-noctilux-m-50-0.95',
    name: 'Noctilux-M 50mm f/0.95 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/0.95',
    maxApertureValue: 0.95,
    tags: ['低光', '人像', '艺术'],
  },
  {
    id: 'leica-elmarit-m-28-2.8',
    name: 'Elmarit-M 28mm f/2.8 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '28mm',
    focalLengthMin: 28,
    focalLengthMax: 28,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['街头', '环境人像', '旅行'],
  },
  {
    id: 'leica-summicron-m-28-2',
    name: 'Summicron-M 28mm f/2 ASPH.',
    brand: 'Leica',
    mount: 'Leica M',
    focalLength: '28mm',
    focalLengthMin: 28,
    focalLengthMax: 28,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['街头', '人文', '低光'],
  },
  // ── 徕卡 SL / L卡口 ──────────────────────────────────────────────────
  {
    id: 'leica-summilux-sl-50-1.4',
    name: 'Summilux-SL 50mm f/1.4 ASPH.',
    brand: 'Leica',
    mount: 'Leica L',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '商业', '高画质'],
  },
  {
    id: 'leica-vario-elmarit-sl-24-90-2.8-4',
    name: 'Vario-Elmarit-SL 24-90mm f/2.8-4 ASPH.',
    brand: 'Leica',
    mount: 'Leica L',
    focalLength: '24-90mm',
    focalLengthMin: 24,
    focalLengthMax: 90,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['旅行', '纪实', '万能'],
  },
  // ── 佳能 Canon RF 卡口 ────────────────────────────────────────────────
  {
    id: 'canon-rf-50-1.2l',
    name: 'Canon RF 50mm f/1.2L USM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '婚礼', '低光'],
  },
  {
    id: 'canon-rf-85-1.2l',
    name: 'Canon RF 85mm f/1.2L USM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '婚礼', '美妆'],
  },
  {
    id: 'canon-rf-28-70-2l',
    name: 'Canon RF 28-70mm f/2L USM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '28-70mm',
    focalLengthMin: 28,
    focalLengthMax: 70,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['万能', '婚礼', '纪实'],
  },
  {
    id: 'canon-rf-15-35-2.8l',
    name: 'Canon RF 15-35mm f/2.8L IS USM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '15-35mm',
    focalLengthMin: 15,
    focalLengthMax: 35,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['风光', '建筑', '星空'],
  },
  {
    id: 'canon-rf-24-70-2.8l',
    name: 'Canon RF 24-70mm f/2.8L IS USM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '24-70mm',
    focalLengthMin: 24,
    focalLengthMax: 70,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '商业', '纪实'],
  },
  {
    id: 'canon-rf-70-200-2.8l',
    name: 'Canon RF 70-200mm f/2.8L IS USM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '70-200mm',
    focalLengthMin: 70,
    focalLengthMax: 200,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['体育', '野生动物', '人像'],
  },
  {
    id: 'canon-rf-35-1.8',
    name: 'Canon RF 35mm f/1.8 Macro IS STM',
    brand: 'Canon',
    mount: 'Canon RF',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.8',
    maxApertureValue: 1.8,
    tags: ['街头', '微距', '日常'],
  },
  // ── 佳能 Canon EF 卡口 ────────────────────────────────────────────────
  {
    id: 'canon-ef-50-1.2l',
    name: 'Canon EF 50mm f/1.2L USM',
    brand: 'Canon',
    mount: 'Canon EF',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '婚礼', '低光'],
  },
  {
    id: 'canon-ef-85-1.4l',
    name: 'Canon EF 85mm f/1.4L IS USM',
    brand: 'Canon',
    mount: 'Canon EF',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '时尚', '美妆'],
  },
  {
    id: 'canon-ef-24-70-2.8l',
    name: 'Canon EF 24-70mm f/2.8L II USM',
    brand: 'Canon',
    mount: 'Canon EF',
    focalLength: '24-70mm',
    focalLengthMin: 24,
    focalLengthMax: 70,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '商业', '纪实'],
  },
  // ── 尼康 Nikon Z 卡口 ─────────────────────────────────────────────────
  {
    id: 'nikon-z-50-1.8s',
    name: 'Nikon Z 50mm f/1.8 S',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.8',
    maxApertureValue: 1.8,
    tags: ['人像', '日常', '街头'],
  },
  {
    id: 'nikon-z-85-1.8s',
    name: 'Nikon Z 85mm f/1.8 S',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.8',
    maxApertureValue: 1.8,
    tags: ['人像', '美妆', '时尚'],
  },
  {
    id: 'nikon-z-58-0.95-noct',
    name: 'Nikon Z 58mm f/0.95 S Noct',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '58mm',
    focalLengthMin: 58,
    focalLengthMax: 58,
    maxAperture: 'f/0.95',
    maxApertureValue: 0.95,
    tags: ['低光', '艺术', '人像'],
  },
  {
    id: 'nikon-z-24-70-2.8s',
    name: 'Nikon Z 24-70mm f/2.8 S',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '24-70mm',
    focalLengthMin: 24,
    focalLengthMax: 70,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '商业', '纪实'],
  },
  {
    id: 'nikon-z-14-24-2.8s',
    name: 'Nikon Z 14-24mm f/2.8 S',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '14-24mm',
    focalLengthMin: 14,
    focalLengthMax: 24,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['风光', '建筑', '星空'],
  },
  {
    id: 'nikon-z-70-200-2.8s',
    name: 'Nikon Z 70-200mm f/2.8 VR S',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '70-200mm',
    focalLengthMin: 70,
    focalLengthMax: 200,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['体育', '野生动物', '人像'],
  },
  {
    id: 'nikon-z-35-1.8s',
    name: 'Nikon Z 35mm f/1.8 S',
    brand: 'Nikon',
    mount: 'Nikon Z',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.8',
    maxApertureValue: 1.8,
    tags: ['街头', '旅行', '纪实'],
  },
  // ── 索尼 Sony FE 卡口 ─────────────────────────────────────────────────
  {
    id: 'sony-fe-50-1.2gm',
    name: 'Sony FE 50mm f/1.2 GM',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '时尚', '低光'],
  },
  {
    id: 'sony-fe-85-1.4gm',
    name: 'Sony FE 85mm f/1.4 GM',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '美妆', '婚礼'],
  },
  {
    id: 'sony-fe-35-1.4gm',
    name: 'Sony FE 35mm f/1.4 GM',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['街头', '纪实', '旅行'],
  },
  {
    id: 'sony-fe-24-70-2.8gm',
    name: 'Sony FE 24-70mm f/2.8 GM II',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '24-70mm',
    focalLengthMin: 24,
    focalLengthMax: 70,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '商业', '婚礼'],
  },
  {
    id: 'sony-fe-70-200-2.8gm',
    name: 'Sony FE 70-200mm f/2.8 GM OSS II',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '70-200mm',
    focalLengthMin: 70,
    focalLengthMax: 200,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['体育', '野生动物', '人像'],
  },
  {
    id: 'sony-fe-12-24-2.8gm',
    name: 'Sony FE 12-24mm f/2.8 GM',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '12-24mm',
    focalLengthMin: 12,
    focalLengthMax: 24,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['风光', '建筑', '星空'],
  },
  {
    id: 'sony-fe-100-400-gm',
    name: 'Sony FE 100-400mm f/4.5-5.6 GM OSS',
    brand: 'Sony',
    mount: 'Sony FE',
    focalLength: '100-400mm',
    focalLengthMin: 100,
    focalLengthMax: 400,
    maxAperture: 'f/4.5',
    maxApertureValue: 4.5,
    tags: ['体育', '野生动物', '航空'],
  },
  // ── 富士 Fujifilm XF 卡口 ─────────────────────────────────────────────
  {
    id: 'fuji-xf-56-1.2-wr',
    name: 'Fujifilm XF 56mm f/1.2 R WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm X',
    focalLength: '56mm',
    focalLengthMin: 56,
    focalLengthMax: 56,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '时尚', '婚礼'],
  },
  {
    id: 'fuji-xf-35-1.4',
    name: 'Fujifilm XF 35mm f/1.4 R',
    brand: 'Fujifilm',
    mount: 'Fujifilm X',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['街头', '日常', '纪实'],
  },
  {
    id: 'fuji-xf-90-2',
    name: 'Fujifilm XF 90mm f/2 R LM WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm X',
    focalLength: '90mm',
    focalLengthMin: 90,
    focalLengthMax: 90,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['人像', '美妆', '时尚'],
  },
  {
    id: 'fuji-xf-16-55-2.8',
    name: 'Fujifilm XF 16-55mm f/2.8 R LM WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm X',
    focalLength: '16-55mm',
    focalLengthMin: 16,
    focalLengthMax: 55,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '商业', '旅行'],
  },
  {
    id: 'fuji-xf-23-1.4',
    name: 'Fujifilm XF 23mm f/1.4 R LM WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm X',
    focalLength: '23mm',
    focalLengthMin: 23,
    focalLengthMax: 23,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['街头', '旅行', '纪实'],
  },
  // ── 富士 Fujifilm GF 卡口（中画幅）──────────────────────────────────────
  {
    id: 'fuji-gf-110-2',
    name: 'Fujifilm GF 110mm f/2 R LM WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm G',
    focalLength: '110mm',
    focalLengthMin: 110,
    focalLengthMax: 110,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['人像', '商业广告', '时尚'],
  },
  {
    id: 'fuji-gf-63-2.8',
    name: 'Fujifilm GF 63mm f/2.8 R WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm G',
    focalLength: '63mm',
    focalLengthMin: 63,
    focalLengthMax: 63,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['商业', '风光', '纪实'],
  },
  {
    id: 'fuji-gf-45-2.8',
    name: 'Fujifilm GF 45mm f/2.8 R WR',
    brand: 'Fujifilm',
    mount: 'Fujifilm G',
    focalLength: '45mm',
    focalLengthMin: 45,
    focalLengthMax: 45,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['风光', '建筑', '旅行'],
  },
  // ── 哈苏 Hasselblad XCD 卡口 ─────────────────────────────────────────
  {
    id: 'hasselblad-xcd-90-2.5',
    name: 'Hasselblad XCD 90mm f/2.5',
    brand: 'Hasselblad',
    mount: 'Hasselblad XCD',
    focalLength: '90mm',
    focalLengthMin: 90,
    focalLengthMax: 90,
    maxAperture: 'f/2.5',
    maxApertureValue: 2.5,
    tags: ['人像', '商业广告', '时尚'],
  },
  {
    id: 'hasselblad-xcd-65-2.8',
    name: 'Hasselblad XCD 65mm f/2.8',
    brand: 'Hasselblad',
    mount: 'Hasselblad XCD',
    focalLength: '65mm',
    focalLengthMin: 65,
    focalLengthMax: 65,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['人像', '商业', '风光'],
  },
  {
    id: 'hasselblad-xcd-38-2.5',
    name: 'Hasselblad XCD 38mm f/2.5',
    brand: 'Hasselblad',
    mount: 'Hasselblad XCD',
    focalLength: '38mm',
    focalLengthMin: 38,
    focalLengthMax: 38,
    maxAperture: 'f/2.5',
    maxApertureValue: 2.5,
    tags: ['建筑', '风光', '环境人像'],
  },
  {
    id: 'hasselblad-xcd-35-3.5',
    name: 'Hasselblad XCD 35mm f/3.5',
    brand: 'Hasselblad',
    mount: 'Hasselblad XCD',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/3.5',
    maxApertureValue: 3.5,
    tags: ['风光', '建筑', '环境人像'],
  },
  // ── 蔡司 Zeiss ──────────────────────────────────────────────────────
  {
    id: 'zeiss-otus-55-1.4',
    name: 'Zeiss Otus 55mm f/1.4',
    brand: 'Zeiss',
    mount: 'Canon EF / Nikon F',
    focalLength: '55mm',
    focalLengthMin: 55,
    focalLengthMax: 55,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '商业', '高画质'],
  },
  {
    id: 'zeiss-milvus-85-1.4',
    name: 'Zeiss Milvus 85mm f/1.4',
    brand: 'Zeiss',
    mount: 'Canon EF / Nikon F',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '时尚', '美妆'],
  },
  {
    id: 'zeiss-loxia-35-2',
    name: 'Zeiss Loxia 35mm f/2',
    brand: 'Zeiss',
    mount: 'Sony FE',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['街头', '旅行', '纪实'],
  },
  {
    id: 'zeiss-batis-85-1.8',
    name: 'Zeiss BATIS 85mm f/1.8',
    brand: 'Zeiss',
    mount: 'Sony FE',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.8',
    maxApertureValue: 1.8,
    tags: ['人像', '婚礼', '时尚'],
  },
  {
    id: 'zeiss-batis-25-2',
    name: 'Zeiss BATIS 25mm f/2',
    brand: 'Zeiss',
    mount: 'Sony FE',
    focalLength: '25mm',
    focalLengthMin: 25,
    focalLengthMax: 25,
    maxAperture: 'f/2',
    maxApertureValue: 2.0,
    tags: ['风光', '街头', '旅行'],
  },
  // ── Sigma Art 系列 ────────────────────────────────────────────────────
  {
    id: 'sigma-35-1.4-art',
    name: 'Sigma 35mm f/1.4 DG DN Art',
    brand: 'Sigma',
    mount: 'Sony FE / Leica L',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['街头', '纪实', '低光'],
  },
  {
    id: 'sigma-50-1.4-art',
    name: 'Sigma 50mm f/1.4 DG DN Art',
    brand: 'Sigma',
    mount: 'Sony FE / Leica L',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '低光', '日常'],
  },
  {
    id: 'sigma-85-1.4-art',
    name: 'Sigma 85mm f/1.4 DG DN Art',
    brand: 'Sigma',
    mount: 'Sony FE / Leica L',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.4',
    maxApertureValue: 1.4,
    tags: ['人像', '美妆', '时尚'],
  },
  {
    id: 'sigma-105-2.8-macro-art',
    name: 'Sigma 105mm f/2.8 Macro DG DN Art',
    brand: 'Sigma',
    mount: 'Sony FE / Leica L',
    focalLength: '105mm',
    focalLengthMin: 105,
    focalLengthMax: 105,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['微距', '产品', '昆虫'],
  },
  {
    id: 'sigma-24-70-2.8-art',
    name: 'Sigma 24-70mm f/2.8 DG DN Art',
    brand: 'Sigma',
    mount: 'Sony FE / Leica L',
    focalLength: '24-70mm',
    focalLengthMin: 24,
    focalLengthMax: 70,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '商业', '婚礼'],
  },
  // ── 腾龙 Tamron ──────────────────────────────────────────────────────
  {
    id: 'tamron-sp-85-1.8',
    name: 'Tamron SP 85mm f/1.8 Di VC USD',
    brand: 'Tamron',
    mount: 'Canon EF / Nikon F',
    focalLength: '85mm',
    focalLengthMin: 85,
    focalLengthMax: 85,
    maxAperture: 'f/1.8',
    maxApertureValue: 1.8,
    tags: ['人像', '婚礼', '美妆'],
  },
  {
    id: 'tamron-28-75-2.8-g2',
    name: 'Tamron 28-75mm f/2.8 Di III VXD G2',
    brand: 'Tamron',
    mount: 'Sony FE',
    focalLength: '28-75mm',
    focalLengthMin: 28,
    focalLengthMax: 75,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['万能', '旅行', '婚礼'],
  },
  {
    id: 'tamron-70-180-2.8',
    name: 'Tamron 70-180mm f/2.8 Di III VXD G2',
    brand: 'Tamron',
    mount: 'Sony FE',
    focalLength: '70-180mm',
    focalLengthMin: 70,
    focalLengthMax: 180,
    maxAperture: 'f/2.8',
    maxApertureValue: 2.8,
    tags: ['体育', '人像', '野生动物'],
  },
  // ── 福伦达 Voigtlander ───────────────────────────────────────────────
  {
    id: 'voigtlander-nokton-50-1.0',
    name: 'Voigtlander Nokton 50mm f/1.0 Aspherical',
    brand: 'Voigtlander',
    mount: 'Leica M',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/1.0',
    maxApertureValue: 1.0,
    tags: ['低光', '艺术', '人像'],
  },
  {
    id: 'voigtlander-nokton-35-1.2',
    name: 'Voigtlander Nokton 35mm f/1.2 Aspherical SE',
    brand: 'Voigtlander',
    mount: 'Leica M',
    focalLength: '35mm',
    focalLengthMin: 35,
    focalLengthMax: 35,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['街头', '纪实', '低光'],
  },
  {
    id: 'voigtlander-heliar-50-3.5',
    name: 'Voigtlander Heliar 50mm f/3.5',
    brand: 'Voigtlander',
    mount: 'Leica M',
    focalLength: '50mm',
    focalLengthMin: 50,
    focalLengthMax: 50,
    maxAperture: 'f/3.5',
    maxApertureValue: 3.5,
    tags: ['纪实', '旅行', '日常'],
  },
  // ── 奥林巴斯 Olympus M.Zuiko ────────────────────────────────────────
  {
    id: 'olympus-45-1.2-pro',
    name: 'Olympus M.Zuiko 45mm f/1.2 PRO',
    brand: 'Olympus',
    mount: 'Micro 4/3',
    focalLength: '45mm',
    focalLengthMin: 45,
    focalLengthMax: 45,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '时尚', '婚礼'],
  },
  {
    id: 'olympus-25-1.2-pro',
    name: 'Olympus M.Zuiko 25mm f/1.2 PRO',
    brand: 'Olympus',
    mount: 'Micro 4/3',
    focalLength: '25mm',
    focalLengthMin: 25,
    focalLengthMax: 25,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['街头', '日常', '低光'],
  },
  {
    id: 'olympus-17-1.2-pro',
    name: 'Olympus M.Zuiko 17mm f/1.2 PRO',
    brand: 'Olympus',
    mount: 'Micro 4/3',
    focalLength: '17mm',
    focalLengthMin: 17,
    focalLengthMax: 17,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['街头', '纪实', '风光'],
  },
  // ── 松下 Panasonic Leica DG ─────────────────────────────────────────
  {
    id: 'panasonic-dg-42.5-1.2',
    name: 'Panasonic Leica DG 42.5mm f/1.2 ASPH Power OIS',
    brand: 'Panasonic',
    mount: 'Micro 4/3',
    focalLength: '42.5mm',
    focalLengthMin: 42,
    focalLengthMax: 43,
    maxAperture: 'f/1.2',
    maxApertureValue: 1.2,
    tags: ['人像', '婚礼', '低光'],
  },
  {
    id: 'panasonic-dg-15-1.7',
    name: 'Panasonic Leica DG 15mm f/1.7 ASPH',
    brand: 'Panasonic',
    mount: 'Micro 4/3',
    focalLength: '15mm',
    focalLengthMin: 15,
    focalLengthMax: 15,
    maxAperture: 'f/1.7',
    maxApertureValue: 1.7,
    tags: ['街头', '风光', '低光'],
  },
];

// ===================== 按品牌分组 =====================
export function getLensGroups(): LensGroup[] {
  const brandOrder = [
    'Leica', 'Canon', 'Nikon', 'Sony', 'Fujifilm',
    'Hasselblad', 'Zeiss', 'Sigma', 'Tamron', 'Voigtlander',
    'Olympus', 'Panasonic',
  ];
  const mountLabels: Record<string, string> = {
    Leica: 'M / L 卡口',
    Canon: 'RF / EF 卡口',
    Nikon: 'Z 卡口',
    Sony: 'FE 卡口',
    Fujifilm: 'X / G 卡口',
    Hasselblad: 'XCD 卡口（中画幅）',
    Zeiss: '多卡口',
    Sigma: 'FE / L 卡口 Art系列',
    Tamron: 'FE / EF 卡口',
    Voigtlander: 'M 卡口',
    Olympus: 'Micro 4/3',
    Panasonic: 'Micro 4/3',
  };

  const grouped: Record<string, LensSpec[]> = {};
  for (const lens of LENS_DATABASE) {
    if (!grouped[lens.brand]) grouped[lens.brand] = [];
    grouped[lens.brand].push(lens);
  }

  return brandOrder
    .filter(b => grouped[b])
    .map(b => ({
      brand: b,
      mountLabel: mountLabels[b] ?? '',
      lenses: grouped[b],
    }));
}

// ===================== 设备-镜头联动映射 =====================
/**
 * 根据设备型号返回推荐的镜头 id 列表（高亮提示用）
 * 匹配策略：品牌 + 卡口 + 常用场景
 */
export interface DeviceLensRecommendation {
  /** 推荐镜头 id 列表 */
  recommendedLensIds: string[];
  /** 推荐焦距范围 [min, max]（用于 UI 高亮） */
  focalLengthRange: [number, number];
  /** 推荐光圈范围 [maxApertureMin, maxApertureMax]，数值越小光圈越大 */
  apertureRange: [number, number];
}

const DEVICE_LENS_MAP: Record<string, DeviceLensRecommendation> = {
  // ── Leica M 系列 ─────────────────────────────────────────────────────
  'Leica M11': {
    recommendedLensIds: [
      'leica-summilux-m-35-1.4', 'leica-summilux-m-50-1.4',
      'leica-summicron-m-50-2', 'leica-apo-summicron-m-50-2',
      'leica-noctilux-m-50-0.95', 'leica-elmarit-m-28-2.8',
      'leica-summicron-m-28-2',
      'voigtlander-nokton-50-1.0', 'voigtlander-nokton-35-1.2',
    ],
    focalLengthRange: [28, 90],
    apertureRange: [0.95, 5.6],
  },
  'Leica M11 Monochrom': {
    recommendedLensIds: [
      'leica-summilux-m-35-1.4', 'leica-summicron-m-50-2',
      'leica-apo-summicron-m-50-2', 'leica-elmarit-m-28-2.8',
      'voigtlander-nokton-35-1.2',
    ],
    focalLengthRange: [28, 75],
    apertureRange: [1.4, 5.6],
  },
  'Leica M10-R': {
    recommendedLensIds: [
      'leica-summilux-m-35-1.4', 'leica-summilux-m-50-1.4',
      'leica-summicron-m-50-2', 'leica-elmarit-m-28-2.8',
      'voigtlander-nokton-50-1.0', 'voigtlander-nokton-35-1.2',
    ],
    focalLengthRange: [28, 75],
    apertureRange: [1.4, 5.6],
  },
  'Leica M10 Monochrom': {
    recommendedLensIds: [
      'leica-summilux-m-50-1.4', 'leica-summicron-m-50-2',
      'leica-elmarit-m-28-2.8',
    ],
    focalLengthRange: [28, 50],
    apertureRange: [1.4, 5.6],
  },
  'Leica M6': {
    recommendedLensIds: [
      'leica-summilux-m-35-1.4', 'leica-summilux-m-50-1.4',
      'leica-summicron-m-50-2', 'leica-elmarit-m-28-2.8',
      'voigtlander-nokton-50-1.0', 'voigtlander-heliar-50-3.5',
    ],
    focalLengthRange: [28, 75],
    apertureRange: [1.0, 5.6],
  },
  // ── Leica Q 系列（固定镜头，展示同品牌可换镜参考）──────────────────────
  'Leica Q3': {
    recommendedLensIds: ['leica-summilux-m-35-1.4'],
    focalLengthRange: [28, 35],
    apertureRange: [1.7, 5.6],
  },
  'Leica Q2': {
    recommendedLensIds: ['leica-summilux-m-35-1.4'],
    focalLengthRange: [28, 35],
    apertureRange: [1.7, 5.6],
  },
  // ── Leica SL / S 系列 ─────────────────────────────────────────────────
  'Leica SL2-S': {
    recommendedLensIds: [
      'leica-summilux-sl-50-1.4', 'leica-vario-elmarit-sl-24-90-2.8-4',
      'sigma-35-1.4-art', 'sigma-50-1.4-art',
    ],
    focalLengthRange: [24, 90],
    apertureRange: [1.4, 4.0],
  },
  'Leica SL2': {
    recommendedLensIds: [
      'leica-summilux-sl-50-1.4', 'leica-vario-elmarit-sl-24-90-2.8-4',
    ],
    focalLengthRange: [24, 90],
    apertureRange: [1.4, 4.0],
  },
  // ── Canon EOS R 系列 ──────────────────────────────────────────────────
  'Canon EOS R5': {
    recommendedLensIds: [
      'canon-rf-50-1.2l', 'canon-rf-85-1.2l', 'canon-rf-28-70-2l',
      'canon-rf-15-35-2.8l', 'canon-rf-24-70-2.8l', 'canon-rf-70-200-2.8l',
      'canon-rf-35-1.8',
    ],
    focalLengthRange: [15, 200],
    apertureRange: [1.2, 5.6],
  },
  'Canon EOS R5C': {
    recommendedLensIds: [
      'canon-rf-24-70-2.8l', 'canon-rf-70-200-2.8l',
      'canon-rf-15-35-2.8l', 'canon-rf-50-1.2l',
    ],
    focalLengthRange: [15, 200],
    apertureRange: [1.2, 5.6],
  },
  'Canon EOS R6 Mark II': {
    recommendedLensIds: [
      'canon-rf-50-1.2l', 'canon-rf-85-1.2l',
      'canon-rf-24-70-2.8l', 'canon-rf-35-1.8',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.2, 5.6],
  },
  'Canon EOS R3': {
    recommendedLensIds: [
      'canon-rf-70-200-2.8l', 'canon-rf-24-70-2.8l',
      'canon-rf-50-1.2l',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.2, 5.6],
  },
  // ── Canon 5D / 1DX 系列（EF 卡口）─────────────────────────────────────
  'Canon EOS 5D Mark IV': {
    recommendedLensIds: [
      'canon-ef-50-1.2l', 'canon-ef-85-1.4l', 'canon-ef-24-70-2.8l',
      'zeiss-otus-55-1.4', 'zeiss-milvus-85-1.4',
      'tamron-sp-85-1.8',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.2, 5.6],
  },
  'Canon EOS 1DX Mark III': {
    recommendedLensIds: [
      'canon-ef-50-1.2l', 'canon-ef-85-1.4l', 'canon-ef-24-70-2.8l',
    ],
    focalLengthRange: [24, 400],
    apertureRange: [1.2, 5.6],
  },
  // ── Nikon Z 系列 ──────────────────────────────────────────────────────
  'Nikon Z9': {
    recommendedLensIds: [
      'nikon-z-50-1.8s', 'nikon-z-85-1.8s', 'nikon-z-35-1.8s',
      'nikon-z-24-70-2.8s', 'nikon-z-14-24-2.8s', 'nikon-z-70-200-2.8s',
      'nikon-z-58-0.95-noct',
    ],
    focalLengthRange: [14, 200],
    apertureRange: [0.95, 5.6],
  },
  'Nikon Z8': {
    recommendedLensIds: [
      'nikon-z-50-1.8s', 'nikon-z-85-1.8s', 'nikon-z-35-1.8s',
      'nikon-z-24-70-2.8s', 'nikon-z-70-200-2.8s',
    ],
    focalLengthRange: [14, 200],
    apertureRange: [1.8, 5.6],
  },
  'Nikon Z7 II': {
    recommendedLensIds: [
      'nikon-z-50-1.8s', 'nikon-z-85-1.8s',
      'nikon-z-24-70-2.8s', 'nikon-z-14-24-2.8s',
    ],
    focalLengthRange: [14, 200],
    apertureRange: [1.8, 5.6],
  },
  'Nikon Z6 III': {
    recommendedLensIds: [
      'nikon-z-50-1.8s', 'nikon-z-35-1.8s',
      'nikon-z-24-70-2.8s', 'nikon-z-85-1.8s',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.8, 5.6],
  },
  'Nikon Z6 II': {
    recommendedLensIds: [
      'nikon-z-50-1.8s', 'nikon-z-35-1.8s', 'nikon-z-24-70-2.8s',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.8, 5.6],
  },
  // ── Nikon D 系列（EF 卡口）────────────────────────────────────────────
  'Nikon D850': {
    recommendedLensIds: [
      'zeiss-otus-55-1.4', 'zeiss-milvus-85-1.4', 'tamron-sp-85-1.8',
    ],
    focalLengthRange: [14, 400],
    apertureRange: [1.4, 5.6],
  },
  // ── Sony A7 / FX 系列 ─────────────────────────────────────────────────
  'Sony A7R V': {
    recommendedLensIds: [
      'sony-fe-50-1.2gm', 'sony-fe-85-1.4gm', 'sony-fe-35-1.4gm',
      'sony-fe-24-70-2.8gm', 'sony-fe-12-24-2.8gm',
      'zeiss-loxia-35-2', 'zeiss-batis-85-1.8', 'zeiss-batis-25-2',
      'sigma-35-1.4-art', 'sigma-50-1.4-art', 'sigma-85-1.4-art',
    ],
    focalLengthRange: [12, 200],
    apertureRange: [1.2, 5.6],
  },
  'Sony A7R IV': {
    recommendedLensIds: [
      'sony-fe-50-1.2gm', 'sony-fe-85-1.4gm',
      'sony-fe-24-70-2.8gm', 'zeiss-loxia-35-2',
      'sigma-35-1.4-art', 'sigma-50-1.4-art',
    ],
    focalLengthRange: [12, 200],
    apertureRange: [1.2, 5.6],
  },
  'Sony A7 IV': {
    recommendedLensIds: [
      'sony-fe-50-1.2gm', 'sony-fe-85-1.4gm', 'sony-fe-35-1.4gm',
      'sony-fe-24-70-2.8gm', 'tamron-28-75-2.8-g2',
      'sigma-35-1.4-art', 'sigma-50-1.4-art',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.2, 5.6],
  },
  'Sony A7 III': {
    recommendedLensIds: [
      'sony-fe-50-1.2gm', 'sony-fe-35-1.4gm',
      'sony-fe-24-70-2.8gm', 'tamron-28-75-2.8-g2',
      'sigma-35-1.4-art',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.2, 5.6],
  },
  'Sony A7S III': {
    recommendedLensIds: [
      'sony-fe-50-1.2gm', 'sony-fe-35-1.4gm',
      'sony-fe-24-70-2.8gm', 'sony-fe-12-24-2.8gm',
      'sigma-35-1.4-art',
    ],
    focalLengthRange: [12, 200],
    apertureRange: [1.2, 5.6],
  },
  'Sony A9 III': {
    recommendedLensIds: [
      'sony-fe-70-200-2.8gm', 'sony-fe-100-400-gm',
      'sony-fe-24-70-2.8gm', 'sony-fe-85-1.4gm',
    ],
    focalLengthRange: [24, 400],
    apertureRange: [1.4, 5.6],
  },
  'Sony FX3': {
    recommendedLensIds: [
      'sony-fe-50-1.2gm', 'sony-fe-24-70-2.8gm',
      'sony-fe-35-1.4gm', 'sigma-35-1.4-art',
      'tamron-28-75-2.8-g2',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.2, 5.6],
  },
  'Sony FX6': {
    recommendedLensIds: [
      'sony-fe-24-70-2.8gm', 'sony-fe-70-200-2.8gm',
      'sony-fe-50-1.2gm',
    ],
    focalLengthRange: [12, 400],
    apertureRange: [1.2, 5.6],
  },
  'Sony FX9': {
    recommendedLensIds: [
      'sony-fe-24-70-2.8gm', 'sony-fe-70-200-2.8gm',
      'sony-fe-12-24-2.8gm',
    ],
    focalLengthRange: [12, 400],
    apertureRange: [1.2, 5.6],
  },
  // ── Fujifilm X 系列 ───────────────────────────────────────────────────
  'Fujifilm X-T5': {
    recommendedLensIds: [
      'fuji-xf-56-1.2-wr', 'fuji-xf-35-1.4', 'fuji-xf-90-2',
      'fuji-xf-16-55-2.8', 'fuji-xf-23-1.4',
    ],
    focalLengthRange: [16, 90],
    apertureRange: [1.2, 5.6],
  },
  'Fujifilm X-T4': {
    recommendedLensIds: [
      'fuji-xf-56-1.2-wr', 'fuji-xf-35-1.4', 'fuji-xf-16-55-2.8',
    ],
    focalLengthRange: [16, 90],
    apertureRange: [1.2, 5.6],
  },
  'Fujifilm X-T3': {
    recommendedLensIds: ['fuji-xf-35-1.4', 'fuji-xf-56-1.2-wr', 'fuji-xf-16-55-2.8'],
    focalLengthRange: [16, 90],
    apertureRange: [1.2, 5.6],
  },
  'Fujifilm X-Pro3': {
    recommendedLensIds: [
      'fuji-xf-35-1.4', 'fuji-xf-23-1.4', 'fuji-xf-56-1.2-wr',
    ],
    focalLengthRange: [16, 56],
    apertureRange: [1.2, 5.6],
  },
  // ── Fujifilm GFX 系列（中画幅）────────────────────────────────────────
  'Fujifilm GFX 100S II': {
    recommendedLensIds: [
      'fuji-gf-110-2', 'fuji-gf-63-2.8', 'fuji-gf-45-2.8',
    ],
    focalLengthRange: [35, 110],
    apertureRange: [2.0, 5.6],
  },
  'Fujifilm GFX 100S': {
    recommendedLensIds: ['fuji-gf-110-2', 'fuji-gf-63-2.8', 'fuji-gf-45-2.8'],
    focalLengthRange: [35, 110],
    apertureRange: [2.0, 5.6],
  },
  'Fujifilm GFX 50S II': {
    recommendedLensIds: ['fuji-gf-63-2.8', 'fuji-gf-45-2.8'],
    focalLengthRange: [35, 110],
    apertureRange: [2.0, 5.6],
  },
  // ── Hasselblad X / H 系列 ─────────────────────────────────────────────
  'Hasselblad X2D 100C': {
    recommendedLensIds: [
      'hasselblad-xcd-90-2.5', 'hasselblad-xcd-65-2.8',
      'hasselblad-xcd-38-2.5', 'hasselblad-xcd-35-3.5',
    ],
    focalLengthRange: [30, 135],
    apertureRange: [2.5, 5.6],
  },
  'Hasselblad H6D-100c': {
    recommendedLensIds: [
      'hasselblad-xcd-90-2.5', 'hasselblad-xcd-65-2.8',
    ],
    focalLengthRange: [35, 150],
    apertureRange: [2.5, 5.6],
  },
  'Hasselblad 907X 50C': {
    recommendedLensIds: [
      'hasselblad-xcd-65-2.8', 'hasselblad-xcd-38-2.5',
    ],
    focalLengthRange: [30, 90],
    apertureRange: [2.5, 5.6],
  },
  // ── OM System / Olympus 系列 ──────────────────────────────────────────
  'OM System OM-1 Mark II': {
    recommendedLensIds: [
      'olympus-45-1.2-pro', 'olympus-25-1.2-pro', 'olympus-17-1.2-pro',
      'panasonic-dg-42.5-1.2', 'panasonic-dg-15-1.7',
    ],
    focalLengthRange: [17, 45],
    apertureRange: [1.2, 5.6],
  },
  'OM System OM-1': {
    recommendedLensIds: [
      'olympus-45-1.2-pro', 'olympus-25-1.2-pro', 'olympus-17-1.2-pro',
    ],
    focalLengthRange: [17, 45],
    apertureRange: [1.2, 5.6],
  },
  'Olympus E-M1X': {
    recommendedLensIds: [
      'olympus-45-1.2-pro', 'olympus-25-1.2-pro', 'olympus-17-1.2-pro',
    ],
    focalLengthRange: [17, 45],
    apertureRange: [1.2, 5.6],
  },
  // ── Panasonic LUMIX 系列 ──────────────────────────────────────────────
  'Panasonic LUMIX S5 II': {
    recommendedLensIds: [
      'sigma-35-1.4-art', 'sigma-50-1.4-art', 'sigma-85-1.4-art',
      'sigma-24-70-2.8-art',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.4, 5.6],
  },
  'Panasonic LUMIX S1R': {
    recommendedLensIds: [
      'sigma-35-1.4-art', 'sigma-50-1.4-art',
    ],
    focalLengthRange: [24, 200],
    apertureRange: [1.4, 5.6],
  },
  'Panasonic LUMIX GH6': {
    recommendedLensIds: [
      'panasonic-dg-42.5-1.2', 'panasonic-dg-15-1.7',
      'olympus-25-1.2-pro', 'olympus-17-1.2-pro',
    ],
    focalLengthRange: [15, 45],
    apertureRange: [1.2, 5.6],
  },
  'Panasonic LUMIX GH5 II': {
    recommendedLensIds: ['panasonic-dg-42.5-1.2', 'panasonic-dg-15-1.7'],
    focalLengthRange: [15, 45],
    apertureRange: [1.2, 5.6],
  },
};

/**
 * 根据已选设备型号获取推荐信息
 * 若没有精确匹配，按品牌前缀模糊匹配
 */
export function getRecommendationForDevice(deviceName: string): DeviceLensRecommendation | null {
  if (!deviceName) return null;

  // 精确匹配
  if (DEVICE_LENS_MAP[deviceName]) return DEVICE_LENS_MAP[deviceName];

  // 前缀模糊匹配（取第一个匹配）
  const lower = deviceName.toLowerCase();
  const fuzzyKey = Object.keys(DEVICE_LENS_MAP).find(k => {
    const kl = k.toLowerCase();
    return lower.includes(kl.split(' ').slice(0, 2).join(' ')) ||
           kl.includes(lower.split(' ').slice(0, 2).join(' '));
  });
  return fuzzyKey ? DEVICE_LENS_MAP[fuzzyKey] : null;
}

/**
 * 获取所有镜头按品牌分组后的扁平列表（按品牌排序）
 */
export function getLensesFlat(): LensSpec[] {
  return getLensGroups().flatMap(g => g.lenses);
}
