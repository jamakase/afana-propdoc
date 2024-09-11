SCRIPT_DIR=$(dirname "$0")
REGISTRY="cr.yandex/crpc50gkvq2bp251sfgb"

for d in $SCRIPT_DIR/../helm/charts/* ; do
    if [ "$(basename "$d")" != "propdoc" ]; then
        helm package -u "$d" -d ./packaged-charts
    fi
done

helm repo index ./packaged-charts --url oci://${REGISTRY}

helm package -u $SCRIPT_DIR/../helm/charts/propdoc -d ./packaged-charts
helm push ./packaged-charts/propdoc-0.1.0.tgz oci://${REGISTRY}
