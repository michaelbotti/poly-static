const process = require(`process`)
const { Metadata, credentials } = require(`@grpc/grpc-js`)
const api = require(`@opentelemetry/api`)
const { TracerShim } = require(`@opentelemetry/shim-opentracing`)
const opentracing = require(`opentracing`)
const { NodeSDK } = require(`@opentelemetry/sdk-node`)
const {
  getNodeAutoInstrumentations,
} = require(`@opentelemetry/auto-instrumentations-node`)
const { Resource } = require(`@opentelemetry/resources`)
const {
  SemanticResourceAttributes,
} = require(`@opentelemetry/semantic-conventions`)
const {
  CollectorTraceExporter,
} = require(`@opentelemetry/exporter-collector-grpc`)

const metadata = new Metadata()
metadata.set(`x-honeycomb-team`, `409ed89f434725e189f5edf5c20cbfbb`)
metadata.set(`x-honeycomb-dataset`, `Gatsby Build`)
const traceExporter = new CollectorTraceExporter({
  url: `grpc://api.honeycomb.io:443/`,
  credentials: credentials.createSsl(),
  metadata,
})

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `gatsby`,
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk
  .start()
  .then(() => console.log(`Tracing initialized`))
  .catch(error => console.log(`Error initializing tracing`, error))

exports.create = () => {
  // We shim Gatsby's use of OpenTracing for OpenTelemetry
  const tracer = api.trace.getTracer(`my-tracer`)
  return new TracerShim(tracer)
}

exports.stop = async () => {
  await sdk.shutdown()
}
