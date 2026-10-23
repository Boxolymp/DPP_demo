export const resolvePath = (to: string, productId: string) => to.replace(':productId', productId);

export const productPath = (productId: string, page: string) => `/products/${productId}/${page}`;
