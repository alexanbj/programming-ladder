#! /bin/bash

javac $1/$2.java 
java -cp $1 $2
rm $1/$2.class

