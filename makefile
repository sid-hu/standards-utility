PROTO_IN = $(addprefix proto/local/,data.proto generic.proto types.proto)
PROTO_OUT = src

protobuf:
	protoc -I=. $(PROTO_IN) \
		--js_out=import_style=commonjs:$(PROTO_OUT) \
		--grpc-web_out=import_style=typescript,mode=grpcwebtext:$(PROTO_OUT)

start:
	$(call ENV,PLATFORM,web)
	pnpm run dev
