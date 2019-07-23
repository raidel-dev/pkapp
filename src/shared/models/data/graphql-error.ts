export class GraphQLErrorLocation {
  public line: number;
  public column: number;
}

export class GraphQLErrorExtensions {
  public code: string;
  public exception: GraphQLErrorException;
}

export class GraphQLErrorException {
  public stacktrace: string[];
}

export class GraphQLError {
  public message: string;
  public locations: GraphQLErrorLocation[];
  public path: string[];
  public extensions: GraphQLErrorExtensions;
}