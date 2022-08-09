NPX := pnpm exec

PROTO_IN := $(addprefix local/,data.proto generic.proto)
PROTO_OUT := src/proto

protobuf:
	$(NPX) protoc -I=proto --ts_out $(PROTO_OUT) $(PROTO_IN)
