import React from "react";
import {
  useQuery,
  usePaginatedQuery,
  useMutation,
  queryCache,
  useIsFetching,
} from "react-query";

import ApiService, {
  ArticlesService,
  CommentsService,
  TagsService,
  FavoriteService,
} from "./api.service";
import { usePaginator } from "./utils";
import { config } from "process";

const defaultConfig = {
  refetchOnWindowFocus: false,
};

export const useArticles = (tagFilter) => {
  const [paginator, nextPage] = usePaginator();
  const queryInfo = usePaginatedQuery(
    ["articles", { ...paginator, tagFilter }],
    async (_, params) => {
      const { data } = await ArticlesService.query("", params);
      return data.articles;
    },
    {
      ...defaultConfig,
      ...config,
    }
  );

  return { ...queryInfo, nextPage };
};

export const useArticle = (slug, config) => {
  return useQuery(
    ["article", slug],
    async (_, slug) => {
      const { data } = await ArticlesService.get(slug);
      return data.article;
    },
    { ...defaultConfig, ...config }
  );
};

export const useFeed = (config) => {
  return useQuery(
    "feed",
    async () => {
      const { data } = await ArticlesService.query("feed");
      return data.articles;
    },
    { ...defaultConfig, ...config }
  );
};

export const useComments = (slug, config) => {
  return useQuery(
    ["comments", slug],
    async (_, slug) => {
      const { data } = await CommentsService.get(slug);
      return data.comments;
    },
    { ...defaultConfig, ...config }
  );
};

export const useTags = (config) => {
  return useQuery(
    "tags",
    async () => {
      const { data } = await TagsService.get();
      return data.tags;
    },
    { ...defaultConfig, ...config }
  );
};

export const useMutationAddToFav = (slug) => {
  return useMutation(() => FavoriteService.add(slug), {
    onSuccess: (data) => queryCache.invalidateQueries(["article", slug]),
  });
};

export const useMutationRemoveFromFav = (slug) => {
  return useMutation(() => FavoriteService.remove(slug), {
    onSuccess: (data) => queryCache.invalidateQueries(["article", slug]),
  });
};

export const useMutationFollow = () =>
  useMutation((username) => ApiService.post(`profiles/${username}/follow`), {
    onSuccess: () => queryCache.invalidateQueries("feed"),
  });

export const useMutationUnFollow = () =>
  useMutation((username) => ApiService.delete(`profiles/${username}/follow`), {
    onSuccess: () => queryCache.invalidateQueries("feed"),
  });

export const useMutationPostComment = (article) =>
  useMutation((args) => CommentsService.post(article.slug, args), {
    onSuccess: (data) => {
      queryCache.invalidateQueries(["comments", article.slug]);
    },
  });

export const useMutationDeleteComment = (slug) =>
  useMutation((id) => CommentsService.destroy(slug, id), {
    onSuccess: (data) => {
      queryCache.invalidateQueries(["comments", slug]);
    },
  });

export const useMutationPublishArticle = () =>
  useMutation(async ({ user, articleInfo }) => {
    const { id, username, bio, image, email } = user;
    const article = {
      author: {
        id,
        username,
        bio,
        image,
        email,
      },
      ...articleInfo,
    };

    const { data } = articleInfo.slug
      ? await ArticlesService.update(article)
      : await ArticlesService.create(article);

    return data.article;
  });

export const useMutationDeleteArticle = () =>
  useMutation((article) => ArticlesService.destroy(article.slug), {
    onSuccess: () => {
      queryCache.invalidateQueries("article");
      queryCache.invalidateQueries("articles");
    },
  });

export const useIsLoading = () => {
  const isFetching = useIsFetching();
  return isFetching > 0 ? true : false;
};

export const useUserArticles = (username) => {
  return useQuery(
    "userArticles",
    async (_) => {
      console.log('useUserArticles', username);
      const { data } = await ArticlesService.query("", {
        author: username
      });
      return data.articles;
    },
    { ...defaultConfig, ...config }
  );
};

export const useUserFavs = (username) => {
  return useQuery(
    "userFavs",
    async (_) => {
      const { data } = await ArticlesService.query("", {
        favorited: username
      });
      return data.articles;
    },
    { ...defaultConfig, ...config }
  );
};

export const useMutationUpdateUser = () => 
  useMutation(userData => {
    console.log('userData', userData);
    return ApiService.put('user', {user: userData })
  });
