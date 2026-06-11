import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import {
  products as staticProducts,
  collections as staticCollections,
  formatPrice as staticFormatPrice,
} from '../data/products';

/**
 * Fetches products from InsForge, falls back to static data.
 */
export function useProducts() {
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await insforge
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (!error && data?.length > 0) {
          setProducts(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              brand: p.brand,
              price: p.price,
              slug: p.slug,
              description: p.description,
              dimensions: p.dimensions,
              care: p.care_instructions,
              customisation: p.customisation_info,
              fabric: p.fabric,
              occasion: p.occasion || [],
              colorClass1: p.color_class_1 || 'saree-a',
              colorClass2: p.color_class_2 || 'saree-f',
              tag: p.tag,
              availability: p.availability,
              sizes: p.sizes || ['None', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
            }))
          );
        }
      } catch (e) {
        console.warn('InsForge fetch failed, using static data:', e.message);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { products, loading };
}

/**
 * Fetches a single product by slug from InsForge.
 */
export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await insforge
          .from('products')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (!error && data) {
          setProduct({
            id: data.id,
            name: data.name,
            brand: data.brand,
            price: data.price,
            slug: data.slug,
            description: data.description,
            dimensions: data.dimensions,
            care: data.care_instructions,
            customisation: data.customisation_info,
            fabric: data.fabric,
            occasion: data.occasion || [],
            colorClass1: data.color_class_1 || 'saree-a',
            colorClass2: data.color_class_2 || 'saree-f',
            tag: data.tag,
            availability: data.availability,
            sizes: data.sizes || ['None', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
          });
        } else {
          // Fallback to static
          const found = staticProducts.find((p) => p.slug === slug);
          setProduct(found || null);
        }
      } catch {
        const found = staticProducts.find((p) => p.slug === slug);
        setProduct(found || null);
      }
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { product, loading };
}

/**
 * Fetches collections from InsForge.
 */
export function useCollections() {
  const [collections, setCollections] = useState(staticCollections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await insforge
          .from('collections')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data?.length > 0) {
          setCollections(
            data.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              colorClass: c.color_class || 'saree-a',
              productCount: c.product_count,
            }))
          );
        }
      } catch {
        // keep static
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { collections, loading };
}
