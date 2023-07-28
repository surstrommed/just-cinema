import { Context } from "koa";
import FilmModel, {
  IOriginalFilm,
  IFilmWithCategory,
  SortFilmType,
  SortFilmOrder,
} from "@/models/film";
import CategoryModel from "@/models/category";
import UserModel from "@/models/user";
import {
  NON_AUTHORIZED_REQUEST,
  NOT_FOUND_FILM_WITH_FILENAME,
  NOT_FOUND_FILM_WITH_ID,
  SMT_WENT_WRONG,
  SUCCESSFULLY_FILM_CREATED,
  SUCCESSFULLY_FILM_DELETED,
  SUCCESSFULLY_FILM_UPLOADED,
  USER_DOES_NOT_EXIST,
} from "@/consts/messages";
import mongoose from "mongoose";
import { gfs, gridfsBucket } from "@/app";
import { getFilmSort, getFormattedCategory, getFormattedFilm } from "@/utils";

export const uploadFilm = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    ctx.response.body = {
      file: ctx.request.file,
      message: SUCCESSFULLY_FILM_UPLOADED,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const createFilm = async (ctx: Context) => {
  const {
    creator,
    title,
    description,
    year,
    fileID,
    filename,
    category,
    views,
    thumbnail,
  } = ctx.request.body;

  try {
    const film = await FilmModel.create({
      creator,
      title,
      description,
      year,
      fileID,
      filename,
      category,
      views,
      thumbnail,
      likes: [],
      dislikes: [],
      rating: 0,
      createdAt: Date.parse(new Date().toString()),
      updatedAt: Date.parse(new Date().toString()),
    });

    const filmCategory = await CategoryModel.findOne({ _id: film.category });
    ctx.response.status = 200;
    ctx.response.body = {
      film: {
        ...getFormattedFilm(film),
        categoryInfo: filmCategory ? getFormattedCategory(filmCategory) : null,
      },
      message: SUCCESSFULLY_FILM_CREATED,
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getFilms = async (ctx: Context) => {
  const { limit, page, sortType, sortOrder } = ctx.query;
  try {
    let skip: number,
      formattedLimit: number,
      films: IOriginalFilm[] = [],
      totalFilms = 0;
    totalFilms = await FilmModel.countDocuments();
    if (limit && page) {
      formattedLimit = Number(limit);
      skip = (Number(page) - 1) * formattedLimit;
      films = await FilmModel.find()
        .sort(getFilmSort(sortType as SortFilmType, sortOrder as SortFilmOrder))
        .skip(skip)
        .limit(formattedLimit);
    }

    const formattedFilms = await Promise.all(
      films.map(async (film) => {
        const category = await CategoryModel.findOne({ _id: film.category });
        return {
          ...getFormattedFilm(film),
          categoryInfo: category ? getFormattedCategory(category) : null,
        };
      })
    );

    ctx.response.status = 200;
    ctx.response.body = {
      films: formattedFilms,
      totalFilms,
      limit: limit ? Number(limit) : null,
      page: page ? Number(page) : null,
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const deleteFilm = async (ctx: Context) => {
  const { filmId, filename } = ctx.params;

  try {
    const file = await gfs.files.findOne({
      filename,
    });

    if (file) {
      await gfs.files.deleteOne({
        filename,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_FILM_WITH_ID };
    } else {
      await FilmModel.findByIdAndRemove(filmId);

      const totalFilms = await FilmModel.countDocuments();
      const films = await FilmModel.find();
      const formattedFilms = await Promise.all(
        films.map(async (film) => {
          const category = await CategoryModel.findOne({ _id: film.category });
          return {
            ...getFormattedFilm(film),
            categoryInfo: category ? getFormattedCategory(category) : null,
          };
        })
      );

      ctx.response.status = 200;
      ctx.response.body = {
        message: SUCCESSFULLY_FILM_DELETED,
        films: formattedFilms,
        totalFilms,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getFilmsByCategory = async (ctx: Context) => {
  const { categoryId } = ctx.params;
  const { limit, page, sortType, sortOrder } = ctx.query;

  try {
    let skip: number,
      formattedLimit: number,
      films: IOriginalFilm[] = [],
      totalFilms = 0;
    totalFilms = await FilmModel.countDocuments({ category: categoryId });
    if (limit && page) {
      formattedLimit = Number(limit);
      skip = (Number(page) - 1) * formattedLimit;
      films = await FilmModel.find({ category: categoryId })
        .sort(getFilmSort(sortType as SortFilmType, sortOrder as SortFilmOrder))
        .skip(skip)
        .limit(formattedLimit);
    }

    const formattedFilms = await Promise.all(
      films.map(async (film) => {
        const category = await CategoryModel.findOne({ _id: film.category });
        return {
          ...getFormattedFilm(film),
          categoryInfo: category ? getFormattedCategory(category) : null,
        };
      })
    );

    ctx.response.status = 200;
    ctx.response.body = {
      films: formattedFilms,
      totalFilms,
      limit: limit ? Number(limit) : null,
      page: page ? Number(page) : null,
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getFilmById = async (ctx: Context) => {
  const { filmId } = ctx.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_FILM_WITH_ID };
    } else {
      const film = await FilmModel.findOne({ _id: filmId });

      if (!film) {
        ctx.response.status = 404;
        ctx.response.body = { message: NOT_FOUND_FILM_WITH_ID };
      } else {
        const category = await CategoryModel.findOne({ _id: film.category });
        ctx.response.status = 200;
        ctx.response.body = {
          film: {
            ...getFormattedFilm(film),
            categoryInfo: category ? getFormattedCategory(category) : null,
          },
        };
      }
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getFilmByFilename = async (ctx: Context) => {
  const { filename } = ctx.params;
  try {
    const file = await gfs.files.findOne({
      filename,
    });

    if (!file || file.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_FILM_WITH_FILENAME };
    } else {
      const fileLength = file.length;
      ctx.set("Content-Range", `bytes 0-${fileLength - 1}/${fileLength}`);
      ctx.set("Accept-Range", "bytes");
      ctx.set("Content-Length", fileLength);
      ctx.set("Content-Type", file.contentType);
      const readstream = gridfsBucket.openDownloadStream(file._id);
      ctx.response.status = 200;
      ctx.body = readstream;
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const manageFilmLike = async (ctx: Context) => {
  const { filmId } = ctx.params;
  const { userId } = ctx.request.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_FILM_WITH_ID };
    } else {
      const film = await FilmModel.findOne({ _id: filmId });

      if (!film) {
        ctx.response.status = 404;
        ctx.response.body = { message: NOT_FOUND_FILM_WITH_ID };
      } else {
        const likes = [...(film?.likes || [])];
        const dislikes = [...(film?.dislikes || [])];
        let editedDislikes: string[] = [];
        let editedLikes: string[] = [];
        if (likes.includes(userId)) {
          editedLikes = likes.filter((id) => id !== userId);
        } else {
          editedLikes.push(userId);
        }
        if (dislikes.includes(userId)) {
          editedDislikes = dislikes.filter((id) => id !== userId);
        }
        const rating = editedLikes.length - editedDislikes.length;

        await FilmModel.findByIdAndUpdate(
          filmId,
          {
            likes: editedLikes,
            dislikes: editedDislikes,
            rating,
          },
          {
            new: true,
          }
        )
          .then(async (film) => {
            if (film) {
              const category = await CategoryModel.findOne({
                _id: film.category,
              });
              ctx.response.status = 200;
              ctx.response.body = {
                film: {
                  ...getFormattedFilm(film),
                  categoryInfo: category
                    ? getFormattedCategory(category)
                    : null,
                },
              };
            }
          })
          .catch((err) => {
            ctx.response.status = 200;
            ctx.response.body = { err };
          });
      }
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const manageFilmDislike = async (ctx: Context) => {
  const { filmId } = ctx.params;
  const { userId } = ctx.request.body;

  try {
    const film = await FilmModel.findOne({ _id: filmId });

    if (!film) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_FILM_WITH_ID };
    } else {
      const dislikes = [...(film?.dislikes || [])];
      const likes = [...(film?.likes || [])];
      let editedDislikes: string[] = [];
      let editedLikes: string[] = [];
      if (dislikes.includes(userId)) {
        editedDislikes = dislikes.filter((id) => id !== userId);
      } else {
        editedDislikes.push(userId);
      }
      if (likes.includes(userId)) {
        editedLikes = likes.filter((id) => id !== userId);
      }
      const rating = editedLikes.length - editedDislikes.length;

      await FilmModel.findByIdAndUpdate(
        filmId,
        {
          dislikes: editedDislikes,
          likes: editedLikes,
          rating,
        },
        {
          new: true,
        }
      )
        .then(async (film) => {
          if (film) {
            const category = await CategoryModel.findOne({
              _id: film.category,
            });
            ctx.response.status = 200;
            ctx.response.body = {
              film: {
                ...getFormattedFilm(film),
                categoryInfo: category ? getFormattedCategory(category) : null,
              },
            };
          }
        })
        .catch((err) => {
          ctx.response.status = 200;
          ctx.response.body = { err };
        });
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getWatchLaterFilms = async (ctx: Context) => {
  const { userId } = ctx.request.body;
  const { limit, page, sortType, sortOrder } = ctx.query;

  try {
    if (!userId) {
      ctx.response.status = 401;
      ctx.response.body = { message: NON_AUTHORIZED_REQUEST };
    } else {
      const userIsExisted = await UserModel.findOne({ _id: userId });

      if (!userIsExisted) {
        ctx.response.status = 404;
        ctx.response.body = { message: USER_DOES_NOT_EXIST };
      } else {
        const firstElem = (Number(page) - 1) * Number(limit) || 0;
        const lastElem = firstElem + Number(limit) || 0;
        const watchLaterFilms = userIsExisted.watchLater;
        const filteredFilms: IFilmWithCategory[] = [];
        let filteredFilmsIds = [...(watchLaterFilms || [])];
        await Promise.all(
          watchLaterFilms.map(async (filmId) => {
            const filmIsExisted = await FilmModel.findOne({ _id: filmId });
            if (filmIsExisted) {
              const category = await CategoryModel.findOne({
                _id: filmIsExisted.category,
              });
              filteredFilms.push({
                ...getFormattedFilm(filmIsExisted),
                categoryInfo: category ? getFormattedCategory(category) : null,
              });
            } else {
              filteredFilmsIds = filteredFilmsIds.filter((id) => id !== filmId);
            }
          })
        );
        await UserModel.findByIdAndUpdate(
          userId,
          {
            watchLater: filteredFilmsIds,
          },
          {
            new: true,
          }
        );
        const totalFilms = filteredFilmsIds.length;
        const filmSort = getFilmSort(
          sortType as SortFilmType,
          sortOrder as SortFilmOrder
        );
        const films = filteredFilms
          .sort((a, b) => {
            const sortKey = Object.keys(
              filmSort
            )?.[0] as keyof IFilmWithCategory;
            const sortValue = filmSort[sortKey];
            if (sortValue === 1) {
              return (a[sortKey] as number) - (b[sortKey] as number);
            } else {
              return (b[sortKey] as number) - (a[sortKey] as number);
            }
          })
          .slice(firstElem, lastElem);
        ctx.response.status = 200;
        ctx.response.body = {
          films,
          totalFilms,
          limit: limit ? Number(limit) : null,
          page: page ? Number(page) : null,
        };
      }
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getSearchedFilms = async (ctx: Context) => {
  const { limit, page, search, sortType, sortOrder } = ctx.query;

  try {
    let skip: number,
      formattedLimit: number,
      films: IOriginalFilm[] = [],
      totalFilms = 0;
    if (limit && page && typeof search === "string") {
      const searchKey = new RegExp(search.toLowerCase(), "ig");
      totalFilms = await FilmModel.countDocuments({ title: searchKey });
      formattedLimit = Number(limit);
      skip = (Number(page) - 1) * formattedLimit;
      films = await FilmModel.find({
        title: searchKey,
      })
        .sort(getFilmSort(sortType as SortFilmType, sortOrder as SortFilmOrder))
        .skip(skip)
        .limit(formattedLimit);
    }

    const formattedFilms = await Promise.all(
      films.map(async (film) => {
        const category = await CategoryModel.findOne({ _id: film.category });
        return {
          ...getFormattedFilm(film),
          categoryInfo: category ? getFormattedCategory(category) : null,
        };
      })
    );

    ctx.response.status = 200;
    ctx.response.body = {
      films: formattedFilms,
      totalFilms,
      limit: limit ? Number(limit) : null,
      page: page ? Number(page) : null,
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};
