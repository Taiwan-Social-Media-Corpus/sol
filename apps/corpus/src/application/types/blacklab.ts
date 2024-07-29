export type MetaData = {
  indexName: string;
  fieldName: string;
  isAnnotatedField: boolean;
  displayName: string;
  description: string;
  uiType: string;
  type: string;
  analyzer: string;
  unknownCondition: string;
  unknownValue: string;
  displayValues: { [key: string]: any };
  fieldValues: { [key: string]: number };
  valueListComplete: boolean;
};

export interface DocResponse {
  docPid: string;
  docInfo: DocInfo;
  metadataFieldGroups: any[];
  docFields: DocFields;
  metadataFieldDisplayNames: MetadataFieldDisplayNames;
}

export interface ConcordanceResponse {
  summary: Summary;
  hits: Hit[] | [];
  docInfos: DocInfos | {};
}

export interface DocInfos {
  [key: string]: DocInfo;
}

export interface DocInfo {
  fromInputFile: string[];
  year: string[];
  author: string[];
  media: string[];
  title: string[];
  docId: string[];
  board: string[];
  lengthInTokens: number;
  mayView: boolean;
}

export interface Hit {
  docPid: string;
  start: number;
  end: number;
  left: HitData;
  match: HitData;
  right: HitData;
}

export interface HitData {
  punct: string[];
  pos: string[];
  word: string[];
}

export interface Summary {
  searchParam: SearchParam;
  searchTime: number;
  countTime: number;
  windowFirstResult: number;
  requestedWindowSize: number;
  actualWindowSize: number;
  windowHasPrevious: boolean;
  windowHasNext: boolean;
  stillCounting: boolean;
  numberOfHits: number;
  numberOfHitsRetrieved: number;
  stoppedCountingHits: boolean;
  stoppedRetrievingHits: boolean;
  numberOfDocs: number;
  numberOfDocsRetrieved: number;
  docFields: DocFields;
  metadataFieldDisplayNames: MetadataFieldDisplayNames;
}

export interface DocFields {
  pidField: string;
  titleField: string;
  authorField: string;
  dateField: string;
}

export interface MetadataFieldDisplayNames {
  author: string;
  board: string;
  docId: string;
  fromInputFile: string;
  media: string;
  title: string;
  year: string;
}

export interface SearchParam {
  filter: string;
  first: string;
  indexname: string;
  number: string;
  patt: string;
  wordsaroundhit: string;
}

export interface StatsResponse {
  summary: StatsSummary;
  hitGroups: HitGroup[] | [];
}

export interface HitGroup {
  identity: string;
  identityDisplay: string;
  size: number;
  properties: { name: string; value: string }[];
  numberOfDocs: number;
}

export type StatsSummary = {
  searchParam: StatsSearchParam;
  numberOfGroups: number;
  largestGroupSize: number;
  subcorpusSize: SubcorpusSize;
} & Omit<
  Summary,
  'searchParam' | 'countTime' | 'docFields' | 'metadataFieldDisplayNames'
>;

export type StatsSearchParam = Omit<SearchParam, 'wordsaroundhit'> & {
  group: string;
};

export interface SubcorpusSize {
  documents: number;
  tokens: number;
}

export type TermFreq = {
  termFreq: {
    [key: string]: number;
  };
};

export interface CorpusInfo {
  indexName: string;
  displayName: string;
  description: string;
  status: string;
  contentViewable: boolean;
  textDirection: string;
  documentFormat: string;
  tokenCount: number;
  documentCount: number;
  versionInfo: {
    blackLabBuildTime: Date;
    blackLabVersion: string;
    indexFormat: string;
    timeCreated: Date;
    timeModified: Date;
  };
  fieldInfo: {
    pidField: string;
    titleField: string;
    authorField: string;
    dateField: string;
  };
  annotatedFields: {
    contents: {
      fieldName: string;
      isAnnotatedField: boolean;
      displayName: string;
      description: string;
      hasContentStore: boolean;
      hasXmlTags: boolean;
      hasLengthTokens: boolean;
      mainAnnotation: string;
      displayOrder: string[];
      annotations: {
        word: Annotations;
        pos: Annotations;
        starttag: Annotations;
        punct: Annotations;
      };
    };
  };
  metadataFields: {
    author: MetadataField;
    board: {
      fieldName: string;
      isAnnotatedField: boolean;
      displayName: string;
      description: string;
      uiType: string;
      type: string;
      analyzer: string;
      unknownCondition: string;
      unknownValue: string;
      displayValues: { [key: string]: any };
      fieldValues: { [key: string]: number };
      valueListComplete: boolean;
    };
    docId: MetadataField;
    fromInputFile: {
      fieldName: string;
      isAnnotatedField: boolean;
      displayName: string;
      description: string;
      uiType: string;
      type: string;
      analyzer: string;
      unknownCondition: string;
      unknownValue: string;
      displayValues: { [key: string]: any };
      fieldValues: { [key: string]: number };
      valueListComplete: boolean;
    };
    media: {
      fieldName: string;
      isAnnotatedField: boolean;
      displayName: string;
      description: string;
      uiType: string;
      type: string;
      analyzer: string;
      unknownCondition: string;
      unknownValue: string;
      displayValues: { [key: string]: any };
      fieldValues: { [key: string]: number };
      valueListComplete: boolean;
    };
    title: MetadataField;
    year: MetadataField;
  };
  metadataFieldGroups: any[];
  annotationGroups: { [key: string]: any };
}

export interface Annotations {
  displayName: string;
  description: string;
  uiType: string;
  hasForwardIndex: boolean;
  sensitivity: string;
  offsetsAlternative: string;
  isInternal: boolean;
}

export interface MetadataField {
  fieldName: string;
  isAnnotatedField: boolean;
  displayName: string;
  description: string;
  uiType: string;
  type: string;
  analyzer: string;
  unknownCondition: string;
  unknownValue: string;
  displayValues: { [key: string]: any };
  fieldValues: { [key: string]: number };
  valueListComplete: boolean;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
