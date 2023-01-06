interface PaginatedDto {
  count: number;
  page: number;
  total: number;
  data: unknown;
}

interface StatsDatasetDto {
  name: string;
  times: number[];
}

interface StatsDto {
  method_name: string;
  labels: number[];
  datasets: StatsDatasetDto[];
}
