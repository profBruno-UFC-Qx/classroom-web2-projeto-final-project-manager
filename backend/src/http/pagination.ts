export type PaginationOptions = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

type ParseResult = {
  pagination?: PaginationOptions;
  error?: string;
};

const toNumber = (value: unknown): number | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

export const parsePagination = (
  query: Record<string, unknown>,
  options?: { defaultPageSize?: number; maxPageSize?: number }
): ParseResult => {
  const hasPage = query.page !== undefined;
  const hasPageSize = query.pageSize !== undefined;

  if (!hasPage && !hasPageSize) {
    return {};
  }

  const page = toNumber(query.page);
  const pageSize = toNumber(query.pageSize);

  if ((hasPage && (!page || page < 1)) || (hasPageSize && (!pageSize || pageSize < 1))) {
    return { error: "Invalid pagination parameters" };
  }

  const resolvedPage = page ?? 1;
  const resolvedPageSize = Math.min(
    pageSize ?? options?.defaultPageSize ?? 20,
    options?.maxPageSize ?? 100
  );

  return {
    pagination: {
      page: resolvedPage,
      pageSize: resolvedPageSize,
      skip: (resolvedPage - 1) * resolvedPageSize,
      take: resolvedPageSize,
    },
  };
};
