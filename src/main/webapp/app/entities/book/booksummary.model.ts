export interface IBookSummary {
  available?: number | null;
  issued?: number | null;
  requested?: number | null;
  total?: number | null;
}

export class BookSummary implements IBookSummary {
  constructor(
    public available?: number | null,
    public issued?: number | null,
    public requested?: number | null,
    public total?: number | null
  ) {}
}
