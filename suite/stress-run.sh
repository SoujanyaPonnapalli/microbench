if [ $# -eq 0 ]
then
  echo "Please provide the run number"
  echo "USAGE: ./run.sh x"
  exit 1
fi

mkdir -p results/run$1
outDir=results/run$1

for fileName in stress-*.js; do
  echo "Running $fileName ..."
  for ((i=10; i<100000000; i*=10)); do
    node --max-old-space-size=30720 $fileName $i | tee -a $outDir/$fileName;
  done
done
