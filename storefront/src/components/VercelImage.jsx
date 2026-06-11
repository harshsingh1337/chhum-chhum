import React from 'react';
import { vercelImageUrl } from '../lib/vercelImage';

export default function VercelImage({ src, alt = '', className, style, width, height, loading = 'lazy' }) {
  const w = width || 800;
  const url = vercelImageUrl(src, { w });
  return <img className={className} src={url} alt={alt} style={style} width={width} height={height} loading={loading} />;
}
