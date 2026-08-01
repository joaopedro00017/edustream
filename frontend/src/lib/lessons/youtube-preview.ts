export interface YoutubePreview {
  title: string;
  thumbnailUrl: string;
}

// Endpoint público do YouTube, sem chave de API. Diferente da URL de
// thumbnail (img.youtube.com/vi/{id}/...), o oEmbed devolve 404 de verdade
// para vídeo inexistente/privado/removido — por isso é usado aqui em vez do
// padrão de URL direto.
export async function fetchYoutubePreview(
  videoUrl: string,
): Promise<YoutubePreview | null> {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
  const response = await fetch(oembedUrl);

  if (!response.ok) return null;

  const data = await response.json();
  return { title: data.title, thumbnailUrl: data.thumbnail_url };
}
