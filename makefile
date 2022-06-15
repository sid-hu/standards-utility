NPX := pnpm exec

PROTO_IN := $(addprefix ./proto/local/,data.proto)
PROTO_OUT := src

protobuf:
	$(NPX) protoc --ts_out $(PROTO_OUT)/ $(PROTO_IN)

start: export PLATFORM = web
start:
	pnpm run dev
