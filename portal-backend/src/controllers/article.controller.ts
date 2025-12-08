import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { AppError } from "../middlewares/errorHandler";
import { articleService } from "../services/prismaService";
import { ArticleQueryDTO } from "../models/Article";

/**
 * 获取文章列表
 */
export const getArticles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query: ArticleQueryDTO = {
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 20,
      categoryId: req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined,
      keyword: req.query.keyword as string | undefined,
      sortBy: (req.query.sort as any) || "createdAt",
      order: "desc",
    };

    const result = await articleService.getArticles(query);

    res.json({
      code: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    next(error);
  }
};

/**
 * 根据ID获取文章详情
 */
export const getArticleById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      throw new AppError("无效的文章ID", 400);
    }

    const article = await articleService.getArticleById(id);

    if (!article) {
      throw new AppError("文章不存在", 404);
    }

    res.json({
      code: 200,
      message: "success",
      data: article,
    });
  } catch (error) {
    console.error("获取文章详情失败:", error);
    next(error);
  }
};

/**
 * 获取热门文章
 */
export const getHotArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const articles = await articleService.getHotArticles(limit);

    res.json({
      code: 200,
      message: "success",
      data: articles,
    });
  } catch (error) {
    console.error("获取热门文章失败:", error);
    next(error);
  }
};

/**
 * 获取推荐文章
 */
export const getRecommendArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const articles = await articleService.getRecommendArticles(limit);

    res.json({
      code: 200,
      message: "success",
      data: articles,
    });
  } catch (error) {
    console.error("获取推荐文章失败:", error);
    next(error);
  }
};

/**
 * 搜索文章
 */
export const searchArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyword = req.query.keyword as string;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;

    if (!keyword) {
      throw new AppError("请提供搜索关键词", 400);
    }

    const query: ArticleQueryDTO = {
      page,
      pageSize,
      keyword,
      sortBy: "createdAt",
      order: "desc",
    };

    const result = await articleService.getArticles(query);

    res.json({
      code: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("搜索文章失败:", error);
    next(error);
  }
};

/**
 * 获取相关文章
 */
export const getRelatedArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const limit = Number(req.query.limit) || 5;

    if (!id || isNaN(id)) {
      throw new AppError("无效的文章ID", 400);
    }

    // 获取当前文章的分类
    const currentArticle = await articleService.getArticleById(id);
    if (!currentArticle) {
      throw new AppError("文章不存在", 404);
    }

    // 获取相同分类的其他文章
    const query: ArticleQueryDTO = {
      page: 1,
      pageSize: limit + 1, // 多获取一条以防包含当前文章
      categoryId: currentArticle.categoryId,
      sortBy: "views",
      order: "desc",
    };

    const result = await articleService.getArticles(query);

    // 过滤掉当前文章
    const relatedArticles = result.list
      .filter((a) => a.id !== id)
      .slice(0, limit);

    res.json({
      code: 200,
      message: "success",
      data: relatedArticles,
    });
  } catch (error) {
    console.error("获取相关文章失败:", error);
    next(error);
  }
};
