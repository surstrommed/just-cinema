import { Context } from "koa";
import CommentModel, { IComment, ICommentReply } from "@/models/comment";
import UserModel, { IUser } from "@/models/user";
import {
  SMT_WENT_WRONG,
  SUCCESSFULLY_COMMENT_CREATED,
  COMMENT_DOES_NOT_EXIST,
  SUCCESSFULLY_COMMENT_DELETED,
  SUCCESSFULLY_COMMENT_UPDATED,
} from "@/consts/messages";
import {
  getFormattedComment,
  getFormattedPage,
  getFormattedUser,
} from "@/utils";

export const createComment = async (ctx: Context) => {
  const { limit, page } = ctx.query;
  const { body, userId, parentId, filmId } = ctx.request.body;

  try {
    const formattedLimit = Number(limit);
    const skip = (Number(page) - 1) * formattedLimit;

    const comment = await CommentModel.create({
      body,
      userId,
      parentId,
      filmId,
      createdAt: Date.parse(new Date().toString()),
      updatedAt: Date.parse(new Date().toString()),
    });
    if (parentId) {
      await CommentModel.findByIdAndUpdate(
        parentId,
        { updatedAt: Date.parse(new Date().toString()) },
        {
          new: true,
        }
      );
    }
    const totalComments = await CommentModel.countDocuments({
      filmId,
      parentId: null,
    });
    const comments = await CommentModel.find({
      filmId,
      parentId: null,
    })
      .sort({ createdAt: -1 })
      .limit(formattedLimit)
      .skip(skip);

    let allComments: {
      [commentId: string]: {
        root: IComment;
        replies: ICommentReply[];
        user: IUser | null;
      };
    } = {};

    await Promise.all(
      comments.map(async (comment) => {
        const replies = await CommentModel.find({
          filmId,
          parentId: comment._id,
        }).sort({ createdAt: 1 });
        const user = await UserModel.findOne({ _id: comment.userId });
        allComments[comment.id] = {
          root: getFormattedComment(comment),
          replies: await Promise.all(
            replies.map(async (reply) => {
              const user = await UserModel.findOne({ _id: reply.userId });
              return {
                user: user ? getFormattedUser(user) : null,
                comment: getFormattedComment(reply),
              };
            })
          ),
          user: user ? getFormattedUser(user) : null,
        };
      })
    );

    ctx.response.status = 200;
    ctx.response.body = {
      comment: getFormattedComment(comment),
      comments: allComments,
      totalComments,
      limit: limit ? formattedLimit : null,
      page: getFormattedPage(page, formattedLimit, totalComments),
      message: SUCCESSFULLY_COMMENT_CREATED,
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const updateComment = async (ctx: Context) => {
  const { limit, page } = ctx.query;
  const { commentId, body } = ctx.request.body;

  try {
    const formattedLimit = Number(limit);
    const skip = (Number(page) - 1) * formattedLimit;
    const commentIsExisted = await CommentModel.findOne({ _id: commentId });

    if (!commentIsExisted) {
      ctx.response.status = 404;
      ctx.response.body = { message: COMMENT_DOES_NOT_EXIST };
    } else {
      const newComment = {
        body,
        updatedAt: Date.parse(new Date().toString()),
      };
      await CommentModel.findByIdAndUpdate(commentId, newComment, {
        new: true,
      });
      if (commentIsExisted.parentId) {
        await CommentModel.findByIdAndUpdate(
          commentIsExisted.parentId,
          { updatedAt: Date.parse(new Date().toString()) },
          {
            new: true,
          }
        );
      }
      const updatedComment = await CommentModel.findOne({ _id: commentId });
      const totalComments = await CommentModel.countDocuments({
        filmId: commentIsExisted.filmId,
        parentId: null,
      });
      const comments = await CommentModel.find({
        filmId: commentIsExisted.filmId,
        parentId: null,
      })
        .sort({ createdAt: -1 })
        .limit(formattedLimit)
        .skip(skip);

      let allComments: {
        [commentId: string]: {
          root: IComment;
          replies: ICommentReply[];
          user: IUser | null;
        };
      } = {};

      await Promise.all(
        comments.map(async (comment) => {
          const replies = await CommentModel.find({
            filmId: commentIsExisted.filmId,
            parentId: comment._id,
          }).sort({ createdAt: 1 });
          const user = await UserModel.findOne({ _id: comment.userId });
          allComments[comment.id] = {
            root: getFormattedComment(comment),
            replies: await Promise.all(
              replies.map(async (reply) => {
                const user = await UserModel.findOne({ _id: reply.userId });
                return {
                  user: user ? getFormattedUser(user) : null,
                  comment: getFormattedComment(reply),
                };
              })
            ),
            user: user ? getFormattedUser(user) : null,
          };
        })
      );

      ctx.response.status = 200;
      ctx.response.body = {
        comment: updatedComment,
        comments: allComments,
        totalComments,
        limit: limit ? formattedLimit : null,
        page: getFormattedPage(page, formattedLimit, totalComments),
        message: SUCCESSFULLY_COMMENT_UPDATED,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: SMT_WENT_WRONG };
  }
};

export const deleteComment = async (ctx: Context) => {
  const { limit, page } = ctx.query;
  const { commentId } = ctx.params;

  try {
    const formattedLimit = Number(limit);
    const skip = (Number(page) - 1) * formattedLimit;
    const commentIsExisted = await CommentModel.findOne({ _id: commentId });

    if (!commentIsExisted) {
      ctx.response.status = 404;
      ctx.response.body = { message: COMMENT_DOES_NOT_EXIST };
    } else {
      await CommentModel.findByIdAndRemove(commentId);
      await CommentModel.deleteMany({ parentId: commentId });

      const totalComments = await CommentModel.countDocuments({
        filmId: commentIsExisted.filmId,
        parentId: null,
      });
      const comments = await CommentModel.find({
        filmId: commentIsExisted.filmId,
        parentId: null,
      })
        .sort({ createdAt: -1 })
        .limit(formattedLimit)
        .skip(skip);

      let allComments: {
        [commentId: string]: {
          root: IComment;
          replies: ICommentReply[];
          user: IUser | null;
        };
      } = {};

      await Promise.all(
        comments.map(async (comment) => {
          const replies = await CommentModel.find({
            filmId: commentIsExisted.filmId,
            parentId: comment._id,
          }).sort({ createdAt: 1 });
          const user = await UserModel.findOne({ _id: comment.userId });
          allComments[comment.id] = {
            root: getFormattedComment(comment),
            replies: await Promise.all(
              replies.map(async (reply) => {
                const user = await UserModel.findOne({ _id: reply.userId });
                return {
                  user: user ? getFormattedUser(user) : null,
                  comment: getFormattedComment(reply),
                };
              })
            ),
            user: user ? getFormattedUser(user) : null,
          };
        })
      );

      ctx.response.status = 200;
      ctx.response.body = {
        comments: allComments,
        totalComments,
        limit: limit ? formattedLimit : null,
        page: getFormattedPage(page, formattedLimit, totalComments),
        message: SUCCESSFULLY_COMMENT_DELETED,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getFilmComments = async (ctx: Context) => {
  const { limit, page } = ctx.query;
  const { filmId } = ctx.params;

  try {
    const formattedLimit = Number(limit);
    const skip = (Number(page) - 1) * formattedLimit;
    const totalComments = await CommentModel.countDocuments({
      filmId,
      parentId: null,
    });
    const comments = await CommentModel.find({ filmId, parentId: null })
      .sort({ createdAt: -1 })
      .limit(formattedLimit)
      .skip(skip);

    let allComments: {
      [commentId: string]: {
        root: IComment;
        replies: ICommentReply[];
        user: IUser | null;
      };
    } = {};

    await Promise.all(
      comments.map(async (comment) => {
        const replies = await CommentModel.find({
          filmId,
          parentId: comment._id,
        }).sort({ createdAt: 1 });
        const user = await UserModel.findOne({ _id: comment.userId });
        allComments[comment.id] = {
          root: getFormattedComment(comment),
          replies: await Promise.all(
            replies.map(async (reply) => {
              const user = await UserModel.findOne({ _id: reply.userId });
              return {
                user: user ? getFormattedUser(user) : null,
                comment: getFormattedComment(reply),
              };
            })
          ),
          user: user ? getFormattedUser(user) : null,
        };
      })
    );

    ctx.response.status = 200;
    ctx.response.body = {
      comments: allComments,
      totalComments,
      limit: limit ? formattedLimit : null,
      page: getFormattedPage(page, formattedLimit, totalComments),
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};
